import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {listProductReviews, ReviewConflict, ReviewDuplicate, reviewInput, reviewTargetExists, saveProductReview} from '../lib/reviews';

function database() {
  const sqlite = new DatabaseSync(':memory:');
  for (const file of ['drizzle/0000_magenta_lady_ursula.sql', 'drizzle/0001_product_reviews.sql']) {
    sqlite.exec(readFileSync(file, 'utf8').replaceAll('--> statement-breakpoint', ''));
  }
  const addProduct = (id: string, active = 1) => sqlite.prepare('INSERT INTO products VALUES (?,?,?,?,?,?,?,?,?,?,?)').run(id, id, 'shelves', 'Test fixture', '/images/shelf.webp', 120, 24, 30, 2900, 120, active);
  addProduct('PL-001'); addProduct('PD-001'); addProduct('custom-wood_02'); addProduct('inactive-item', 0);
  const wrap = (sql: string, args: unknown[] = []) => ({
    bind: (...params: unknown[]) => wrap(sql, params),
    first: async () => sqlite.prepare(sql).get(...args as any[]) || null,
    all: async () => ({results: sqlite.prepare(sql).all(...args as any[])}),
    run: async () => sqlite.prepare(sql).run(...args as any[]),
  });
  const db = {prepare: (sql: string) => wrap(sql)} as unknown as D1Database;
  return {db, sqlite};
}
const id = (index: number) => `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`;
const review = (index: number, productId = 'PL-001') => ({requestId: id(index), productId, name: 'Автор теста', text: `Текст локального теста отзыва ${index}.`});
const now = new Date('2026-11-01T00:00:00.000Z');

test('Миграция создаёт пустое хранилище: нет демонстрационных отзывов', async () => {
  const {db, sqlite} = database();
  assert.deepEqual(await listProductReviews(db, 'PL-001'), {reviews: [], total: 0, hasMore: false});
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM product_reviews').get()!.n, 0);
  const indexes = sqlite.prepare("PRAGMA index_list('product_reviews')").all();
  assert.ok(indexes.some(row => row.name === 'product_reviews_product_created'));
});

test('Отзыв сохраняется и повторный запрос с тем же UUID не создаёт копию', async () => {
  const {db, sqlite} = database();
  const input = {...review(1), name: '  Реальный посетитель  ', text: '  Полка подошла по размеру и фактуре.  '};
  const first = await saveProductReview(db, input, now);
  assert.equal(first.created, true);
  assert.equal(first.review.name, 'Реальный посетитель');
  assert.equal(first.review.text, 'Полка подошла по размеру и фактуре.');
  assert.equal(first.review.createdAt, now.toISOString());
  assert.deepEqual(await saveProductReview(db, input, new Date(now.getTime() + 1000)), {review: first.review, created: false});
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM product_reviews').get()!.n, 1);
  assert.equal((await listProductReviews(db, 'PL-001')).reviews[0].id, id(1));
});

test('Отзывы изолированы по изделию, включая кухонную полку', async () => {
  const {db} = database();
  await saveProductReview(db, review(1, 'PL-001'), now);
  await saveProductReview(db, review(2, 'PD-001'), now);
  await saveProductReview(db, review(3, 'kitchen-shelf'), now);
  for (const [productId, number] of [['PL-001', 1], ['PD-001', 2], ['kitchen-shelf', 3]] as const) {
    const result = await listProductReviews(db, productId);
    assert.equal(result.total, 1);
    assert.equal(result.reviews[0].id, id(number));
    assert.equal(result.reviews[0].productId, productId);
  }
});

test('UUID нельзя повторно использовать для другого товара или подмены текста', async () => {
  const {db, sqlite} = database();
  await saveProductReview(db, review(1), now);
  await assert.rejects(saveProductReview(db, {...review(1), productId: 'PD-001'}, now), ReviewConflict);
  await assert.rejects(saveProductReview(db, {...review(1), text: 'Подменённый другой текст отзыва.'}, now), ReviewConflict);
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM product_reviews').get()!.n, 1);
});

test('Случайный одинаковый отзыв с новым UUID в минуту не дублируется', async () => {
  const {db} = database();
  const input = review(1);
  await saveProductReview(db, input, now);
  await assert.rejects(saveProductReview(db, {...input, requestId: id(2)}, new Date(now.getTime() + 1000)), ReviewDuplicate);
  await saveProductReview(db, {...input, requestId: id(3)}, new Date(now.getTime() + 61000));
  assert.equal((await listProductReviews(db, 'PL-001')).total, 2);
});

test('Проверка цели принимает реальные SKU и кухонную полку, отклоняет неизвестные/скрытые', async () => {
  const {db} = database();
  for (const key of ['PL-001', 'PD-001', 'custom-wood_02', 'kitchen-shelf']) assert.equal(await reviewTargetExists(db, key), true);
  for (const key of ['unknown-item', 'inactive-item', "PL-001' OR 1=1", '']) assert.equal(await reviewTargetExists(db, key), false);
});

test('Выдача ограничена десятью записями и сортируется от новых к старым', async () => {
  const {db} = database();
  for (let i = 1; i <= 12; i++) await saveProductReview(db, review(i), new Date(now.getTime() + i * 1000));
  await saveProductReview(db, review(99, 'PD-001'), now);
  const first = await listProductReviews(db, 'PL-001');
  const next = await listProductReviews(db, 'PL-001', 10);
  assert.equal(first.reviews.length, 10); assert.equal(first.total, 12); assert.equal(first.hasMore, true);
  assert.equal(first.reviews[0].id, id(12)); assert.equal(first.reviews[9].id, id(3));
  assert.equal(next.reviews.length, 2); assert.equal(next.hasMore, false);
  assert.equal(next.reviews[0].id, id(2));
  assert.ok(first.reviews.every(row => row.productId === 'PL-001'));
  await assert.rejects(listProductReviews(db, 'PL-001', -1), /offset/);
});

test('Неверный ввод не сохраняется, содержимое HTML хранится только как пользовательский текст', async () => {
  const {db, sqlite} = database();
  for (const input of [
    {...review(1), name: ' '}, {...review(1), text: ' коротко '}, {...review(1), text: 'x'.repeat(2001)},
    {...review(1), name: 'Имя\u0000'}, {...review(1), requestId: 'not-a-uuid'}, {...review(1), unexpected: true},
  ]) {
    assert.equal(reviewInput.safeParse(input).success, false);
    await assert.rejects(saveProductReview(db, input, now));
  }
  assert.equal(sqlite.prepare('SELECT COUNT(*) AS n FROM product_reviews').get()!.n, 0);
  const text = '<script>alert("test")</script> Это буквальный пользовательский текст.';
  const result = await saveProductReview(db, {...review(2), text}, now);
  assert.equal(result.review.text, text);
  assert.equal((await listProductReviews(db, 'PL-001')).reviews[0].text, text);
  // Rendering uses a React text child, never dangerouslySetInnerHTML.
  assert.doesNotMatch(readFileSync('components/product-reviews.tsx', 'utf8'), /dangerouslySetInnerHTML/);
});
