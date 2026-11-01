import {AdminBodyTooLarge, readAdminJson} from '@/lib/admin-auth';
import {rawDb, sameOrigin} from '@/lib/store-server';
import {customerCookie, customerLogin, customerRegistration, dummyCustomerPasswordCheck, hashCustomerPassword, verifyCustomerPassword} from '@/lib/customer-auth';
import {consumeCustomerLimit, createCustomer, createCustomerSession, customerByEmail, deleteCustomerSession, getCustomer} from '@/lib/customer-storage';

export const customerResponse = (body: unknown, status = 200, cookie?: string) => Response.json(body, {status, headers: {'Cache-Control': 'no-store', ...(cookie ? {'Set-Cookie': cookie} : {})}});
const failure = (message: string, status = 400) => customerResponse({error: message}, status);
export async function customerSessionGet(req: Request) {
  try {return customerResponse({user: await getCustomer(rawDb(), req)});} catch {return failure('Не удалось проверить вход. Попробуйте ещё раз.', 503);}
}
export async function customerSessionPost(req: Request, action: 'login' | 'register' | 'logout') {
  if (!sameOrigin(req) || req.headers.get('sec-fetch-site') === 'cross-site') return failure('Недопустимый источник запроса.', 403);
  try {
    const db = rawDb();
    if (action === 'logout') {await deleteCustomerSession(db, req); return customerResponse({ok: true}, 200, customerCookie('', 0));}
    if (!req.headers.get('content-type')?.toLowerCase().includes('application/json')) return failure('Отправьте данные в формате JSON.', 415);
    const input = await readAdminJson(req, 8192);
    const parsed = action === 'register' ? customerRegistration.safeParse(input) : customerLogin.safeParse(input);
    if (!parsed.success) return failure(action === 'register' ? 'Укажите имя (2–60 символов), email и пароль от 10 до 200 символов.' : 'Укажите email и пароль.');
    const {email, password} = parsed.data;
    const ip = req.headers.get('cf-connecting-ip') || 'unknown';
    const ipAllowed = await consumeCustomerLimit(db, 'account-ip', ip, 30);
    const emailAllowed = await consumeCustomerLimit(db, 'account-email', email, 8);
    const registrationAllowed = action !== 'register' || await consumeCustomerLimit(db, 'register-ip', ip, 5);
    if (!ipAllowed || !emailAllowed || !registrationAllowed) return failure('Слишком много попыток. Попробуйте через 15 минут.', 429);
    let user;
    if (action === 'register') {
      const registration = customerRegistration.parse(input);
      user = {id: crypto.randomUUID(), name: registration.name, email};
      const hash = await hashCustomerPassword(password);
      if (!await createCustomer(db, user, hash)) return failure('Не удалось создать аккаунт с этими данными. Попробуйте войти или используйте другой email.');
    } else {
      const account = await customerByEmail(db, email);
      const valid = account ? await verifyCustomerPassword(password, account.passwordHash) : await dummyCustomerPasswordCheck(password);
      if (!account || !valid) return failure('Неверный email или пароль.', 401);
      user = {id: account.id, name: account.name, email: account.email};
    }
    return customerResponse({user}, action === 'register' ? 201 : 200, customerCookie(await createCustomerSession(db, user.id, req)));
  } catch (error) {
    if (error instanceof SyntaxError) return failure('Проверьте отправленные данные.');
    return failure(error instanceof AdminBodyTooLarge ? 'Слишком большой запрос.' : 'Не удалось выполнить вход. Попробуйте ещё раз.', error instanceof AdminBodyTooLarge ? 413 : 503);
  }
}
