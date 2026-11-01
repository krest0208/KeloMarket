import {CUSTOMER_SESSION_SECONDS, customerRequestToken, customerTokenHash, randomCustomerToken, type CustomerProfile} from './customer-auth';

export async function getCustomer(db: D1Database, req: Request, now = Date.now()): Promise<CustomerProfile | null> {
  const token = customerRequestToken(req);
  if (!token) return null;
  return db.prepare(`SELECT u.id, u.name, u.email FROM customer_sessions s JOIN customer_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?`).bind(await customerTokenHash(token), Math.floor(now / 1000)).first<CustomerProfile>();
}
export async function deleteCustomerSession(db: D1Database, req: Request) {
  const token = customerRequestToken(req);
  if (token) await db.prepare('DELETE FROM customer_sessions WHERE token_hash=?').bind(await customerTokenHash(token)).run();
}
export async function createCustomerSession(db: D1Database, userId: string, req: Request, now = Date.now()) {
  const seconds = Math.floor(now / 1000), token = randomCustomerToken(), previous = customerRequestToken(req);
  const statements = [db.prepare('DELETE FROM customer_sessions WHERE expires_at<=?').bind(seconds)];
  if (previous) statements.push(db.prepare('DELETE FROM customer_sessions WHERE token_hash=?').bind(await customerTokenHash(previous)));
  statements.push(db.prepare('INSERT INTO customer_sessions(token_hash,user_id,expires_at,created_at) VALUES (?,?,?,?)').bind(await customerTokenHash(token), userId, seconds + CUSTOMER_SESSION_SECONDS, seconds));
  await db.batch(statements);
  return token;
}
export async function createCustomer(db: D1Database, user: CustomerProfile, passwordHash: string, now = Date.now()) {
  const result = await db.prepare('INSERT OR IGNORE INTO customer_users(id,name,email,password_hash,created_at) VALUES (?,?,?,?,?)').bind(user.id, user.name, user.email, passwordHash, new Date(now).toISOString()).run();
  return result.meta.changes === 1;
}
export async function customerByEmail(db: D1Database, email: string) {
  return db.prepare('SELECT id,name,email,password_hash AS passwordHash FROM customer_users WHERE email=?').bind(email).first<CustomerProfile & {passwordHash: string}>();
}

/** Durable window counters. A random DB-only HMAC key keeps IPs/emails out of the counter table. */
export async function consumeCustomerLimit(db: D1Database, scope: string, identity: string, maximum: number, now = Date.now()) {
  await db.prepare("INSERT OR IGNORE INTO settings(key,value) VALUES ('customer-rate-key',?)").bind(randomCustomerToken()).run();
  const row = await db.prepare("SELECT value FROM settings WHERE key='customer-rate-key'").first<{value: string}>();
  if (!row?.value) throw new Error('Rate limit unavailable');
  const window = Math.floor(now / 900000), expiresAt = (window + 1) * 900;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(row.value), {name: 'HMAC', hash: 'SHA-256'}, false, ['sign']);
  const signed = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${scope}|${window}|${identity}`));
  const hash = Array.from(new Uint8Array(signed), byte => byte.toString(16).padStart(2, '0')).join('');
  await db.prepare('DELETE FROM customer_auth_limits WHERE expires_at<=?').bind(Math.floor(now / 1000)).run();
  const result = await db.prepare(`INSERT INTO customer_auth_limits(key,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=attempts+1 RETURNING attempts`).bind(hash, expiresAt).first<{attempts: number}>();
  return !!result && result.attempts <= maximum;
}
