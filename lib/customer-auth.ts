import {z} from 'zod';

export const CUSTOMER_COOKIE = '__Host-kelo_customer_session';
export const CUSTOMER_SESSION_SECONDS = 14 * 24 * 60 * 60;
export const CUSTOMER_PASSWORD_ITERATIONS = 100000;
const encoder = new TextEncoder();
const printable = (value: string) => !/[\u0000-\u001f\u007f]/.test(value);
export const customerEmail = z.string().trim().email().max(254).transform(value => value.toLowerCase());
export const customerPassword = z.string().min(10).max(200);
export const customerRegistration = z.object({name: z.string().trim().min(2).max(60).refine(value => printable(value) && [...value].length >= 2), email: customerEmail, password: customerPassword}).strict();
export const customerLogin = z.object({email: customerEmail, password: z.string().min(1).max(200)}).strict();
export interface CustomerProfile {id: string; name: string; email: string}

export const randomCustomerToken = () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const toHex = (value: Uint8Array) => Array.from(value, byte => byte.toString(16).padStart(2, '0')).join('');
function fromHex(value: string) {if (!/^[a-f0-9]+$/.test(value) || value.length % 2) throw new Error('Invalid hash'); return Uint8Array.from(value.match(/../g)!, pair => parseInt(pair, 16));}
export async function customerTokenHash(token: string) {return toHex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(token))));}

export async function hashCustomerPassword(password: string) {
  customerPassword.parse(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const result = await crypto.subtle.deriveBits({name: 'PBKDF2', hash: 'SHA-256', salt, iterations: CUSTOMER_PASSWORD_ITERATIONS}, key, 256);
  return `pbkdf2-sha256$${CUSTOMER_PASSWORD_ITERATIONS}$${toHex(salt)}$${toHex(new Uint8Array(result))}`;
}
export async function verifyCustomerPassword(password: string, hash: string) {
  if (!password || password.length > 200) return false;
  try {
    const [algorithm, rounds, salt, digest, ...rest] = hash.split('$');
    if (rest.length || algorithm !== 'pbkdf2-sha256' || Number(rounds) !== CUSTOMER_PASSWORD_ITERATIONS) return false;
    const saltBytes = fromHex(salt), expected = fromHex(digest);
    if (saltBytes.length !== 16 || expected.length !== 32) return false;
    const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const actual = new Uint8Array(await crypto.subtle.deriveBits({name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: CUSTOMER_PASSWORD_ITERATIONS}, key, 256));
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) mismatch |= actual[i] ^ expected[i];
    return mismatch === 0;
  } catch {return false;}
}
// Missing accounts still perform one full password derivation to avoid a fast exit.
export async function dummyCustomerPasswordCheck(password: string) {
  return verifyCustomerPassword(password, `pbkdf2-sha256$${CUSTOMER_PASSWORD_ITERATIONS}$00000000000000000000000000000000$${'00'.repeat(32)}`);
}
export function customerCookie(token: string, seconds = CUSTOMER_SESSION_SECONDS) {
  return `${CUSTOMER_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${seconds}`;
}
export function customerRequestToken(req: Request) {
  const token = req.headers.get('cookie')?.split(';').map(part => part.trim()).find(part => part.startsWith(CUSTOMER_COOKIE + '='))?.slice(CUSTOMER_COOKIE.length + 1);
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : undefined;
}
export function safeAccountReturnPath(input: string | null | undefined) {
  if (!input || input.length > 300 || /[\\\u0000-\u001f\u007f]/.test(input)) return '/products';
  try {
    const url = new URL(input, 'https://kelo.invalid');
    if (url.origin !== 'https://kelo.invalid' || !/^\/(?:products|catalog|constructor|cart|checkout|product\/[A-Za-z0-9_-]+)?$/.test(url.pathname)) return '/products';
    return url.pathname + url.search + url.hash;
  } catch {return '/products';}
}
