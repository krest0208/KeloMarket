import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {CUSTOMER_COOKIE, CUSTOMER_SESSION_SECONDS, customerCookie, customerRegistration, customerRequestToken, customerTokenHash, hashCustomerPassword, randomCustomerToken, safeAccountReturnPath, verifyCustomerPassword} from '../lib/customer-auth';
import {consumeCustomerLimit, createCustomer, createCustomerSession, customerByEmail, deleteCustomerSession, getCustomer} from '../lib/customer-storage';

function database() {
  const sqlite = new DatabaseSync(':memory:'); sqlite.exec('PRAGMA foreign_keys=ON');
  for (const file of ['0000_magenta_lady_ursula', '0001_product_reviews', '0002_unit_inventory', '0003_customer_accounts']) sqlite.exec(readFileSync(`drizzle/${file}.sql`, 'utf8').replaceAll('--> statement-breakpoint', ''));
  type Wrapped = {sql: string; args: unknown[]; bind: (...args: unknown[]) => Wrapped; first: () => Promise<any>; all: () => Promise<any>; run: () => Promise<any>};
  const wrap = (sql: string, args: unknown[] = []): Wrapped => ({sql, args,
    bind: (...values: unknown[]) => wrap(sql, values),
    first: async () => sqlite.prepare(sql).get(...args as any[]) || null,
    all: async () => ({results: sqlite.prepare(sql).all(...args as any[])}),
    run: async () => {const result = sqlite.prepare(sql).run(...args as any[]); return {success: true, meta: {changes: result.changes}};},
  });
  const db = {prepare: (sql: string) => wrap(sql), batch: async (statements: Wrapped[]) => {
    sqlite.exec('BEGIN'); try {const result = []; for (const statement of statements) result.push(await statement.run()); sqlite.exec('COMMIT'); return result;} catch (error) {sqlite.exec('ROLLBACK'); throw error;}
  }} as unknown as D1Database;
  return {db, sqlite};
}
const now = new Date('2026-11-01T00:00:00Z').getTime();
const user = {id: 'local-customer', name: 'Имя покупателя', email: 'person@example.test'};
const request = (token?: string) => new Request('https://store.test/api/account', {headers: token ? {cookie: `${CUSTOMER_COOKIE}=${token}`} : {}});

test('Пароли получают индивидуальную соль и проверяются без хранения исходного значения', async () => {
  const password = 'local test phrase only';
  const first = await hashCustomerPassword(password), second = await hashCustomerPassword(password);
  assert.notEqual(first, second); assert.ok(!first.includes(password));
  assert.equal(await verifyCustomerPassword(password, first), true);
  assert.equal(await verifyCustomerPassword('wrong phrase', first), false);
  assert.equal(await verifyCustomerPassword(password, first + '$extra'), false);
  assert.equal(await verifyCustomerPassword(password, first.replace('$100000$', '$1$')), false);
  await assert.rejects(hashCustomerPassword('short'));
});

test('Регистрация нормализует email и отклоняет неправильные данные', () => {
  const parsed = customerRegistration.parse({name: '  Имя покупателя  ', email: '  Person@EXAMPLE.TEST ', password: 'long local test phrase'});
  assert.equal(parsed.email, user.email); assert.equal(parsed.name, user.name);
  for (const input of [{...parsed, name: ' '}, {...parsed, name: '🌲'}, {...parsed, email: 'invalid'}, {...parsed, name: 'Имя\u0000'}, {...parsed, password: 'short'}, {...parsed, password: 'a'.repeat(201)}, {...parsed, isAdmin: true}]) assert.equal(customerRegistration.safeParse(input).success, false);
});

test('Хранилище не создаёт второй аккаунт с тем же нормализованным email', async () => {
  const {db} = database();
  assert.equal(await createCustomer(db, user, 'local test hash', now), true);
  assert.equal(await createCustomer(db, {...user, id: 'another-id'}, 'another local hash', now), false);
  assert.equal((await customerByEmail(db, user.email))?.id, user.id);
});

test('Сессия хранит только хеш токена, отклоняет подмену, истечение и завершается выходом', async () => {
  const {db, sqlite} = database(); await createCustomer(db, user, 'local test hash', now);
  const token = await createCustomerSession(db, user.id, request(), now);
  assert.match(token, /^[A-Za-z0-9_-]{43}$/);
  const row = sqlite.prepare('SELECT * FROM customer_sessions').get()!;
  assert.notEqual(row.token_hash, token); assert.equal(row.token_hash, await customerTokenHash(token));
  assert.deepEqual({...await getCustomer(db, request(token), now)}, user);
  assert.equal(await getCustomer(db, request(token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a')), now), null);
  assert.equal(await getCustomer(db, request(token), now + CUSTOMER_SESSION_SECONDS * 1000), null);
  await deleteCustomerSession(db, request(token)); assert.equal(await getCustomer(db, request(token), now), null);
});

test('Повторный вход меняет токен и инвалидирует прежнюю сессию браузера', async () => {
  const {db} = database(); await createCustomer(db, user, 'local test hash', now);
  const first = await createCustomerSession(db, user.id, request(), now);
  const second = await createCustomerSession(db, user.id, request(first), now + 1000);
  assert.notEqual(first, second); assert.equal(await getCustomer(db, request(first), now + 1000), null);
  assert.equal((await getCustomer(db, request(second), now + 1000))?.id, user.id);
});

test('Cookie защищена, а перенаправление принимает только внутренние покупательские маршруты', () => {
  const cookie = customerCookie(randomCustomerToken());
  for (const flag of ['__Host-', 'Secure', 'HttpOnly', 'SameSite=Strict', 'Path=/']) assert.ok(cookie.includes(flag));
  assert.ok(customerCookie('', 0).includes('Max-Age=0'));
  assert.equal(customerRequestToken(request('invalid')), undefined);
  assert.equal(safeAccountReturnPath('/product/PL-001#reviews-PL-001'), '/product/PL-001#reviews-PL-001');
  assert.equal(safeAccountReturnPath('/checkout'), '/checkout');
  for (const input of ['//evil.test', 'https://evil.test/path', '/admin', '/api/admin', '/\\evil.test', 'javascript:alert(1)']) assert.equal(safeAccountReturnPath(input), '/products');
});

test('Лимит попыток хранится в D1 и истекает; в счётчиках нет IP или email', async () => {
  const {db, sqlite} = database();
  for (let index = 0; index < 3; index++) assert.equal(await consumeCustomerLimit(db, 'login', 'person@example.test', 3, now), true);
  assert.equal(await consumeCustomerLimit(db, 'login', 'person@example.test', 3, now), false);
  assert.equal(await consumeCustomerLimit(db, 'other-scope', 'person@example.test', 3, now), true);
  assert.equal(await consumeCustomerLimit(db, 'login', '192.0.2.10', 3, now), true);
  for (const row of sqlite.prepare('SELECT * FROM customer_auth_limits').all()) {assert.match(String(row.key), /^[a-f0-9]{64}$/); assert.ok(!JSON.stringify(row).includes('person@')); assert.ok(!JSON.stringify(row).includes('192.0.2'));}
  assert.equal(await consumeCustomerLimit(db, 'login', 'person@example.test', 3, now + 900001), true);
});

test('Миграция сохраняет старые отзывы и не выдумывает авторов аккаунтов', () => {
  const sqlite = new DatabaseSync(':memory:');
  for (const file of ['0000_magenta_lady_ursula', '0001_product_reviews']) sqlite.exec(readFileSync(`drizzle/${file}.sql`, 'utf8').replaceAll('--> statement-breakpoint', ''));
  sqlite.prepare('INSERT INTO product_reviews VALUES (?,?,?,?,?)').run('legacy-test-id', 'PL-001', 'Прежнее имя', 'Прежний локальный тестовый отзыв.', new Date(now).toISOString());
  for (const file of ['0002_unit_inventory', '0003_customer_accounts']) sqlite.exec(readFileSync(`drizzle/${file}.sql`, 'utf8').replaceAll('--> statement-breakpoint', ''));
  const review = sqlite.prepare('SELECT * FROM product_reviews').get()!;
  assert.equal(review.author_name, 'Прежнее имя'); assert.equal(review.user_id, null);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM customer_users').get()!.n, 0);
});
