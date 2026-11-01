import {env} from 'cloudflare:workers';
import {adminConfigured,adminCookie,createAdminSession,verifyAdminPassword,readAdminJson,AdminBodyTooLarge,type AdminSecrets} from '@/lib/admin-auth';
import {errorResponse,sameOrigin} from '@/lib/store-server';
const attempts=new Map<string,{count:number;until:number}>();
export async function POST(req:Request){
 if(!sameOrigin(req))return errorResponse('Недопустимый источник запроса',403);
 const secrets=env as unknown as AdminSecrets;if(!adminConfigured(secrets))return errorResponse('Вход администратора ещё не настроен',503);
 const now=Date.now();const address=req.headers.get('cf-connecting-ip')||req.headers.get('oai-authenticated-user-id')||'site';const previous=attempts.get(address);if(previous&&previous.until>now&&previous.count>=8)return errorResponse('Слишком много попыток. Повторите через 15 минут.',429);
 try{const data=await readAdminJson(req,2048) as {username?:unknown;password?:unknown};if(typeof data.username!=='string'||typeof data.password!=='string'||data.username.length>100||data.password.length>200)return errorResponse('Проверьте логин и пароль');
 const entry=previous&&previous.until>now?previous:{count:0,until:now+15*60*1000};entry.count++;attempts.set(address,entry);if(attempts.size>1000){for(const [key,value] of attempts)if(value.until<=now)attempts.delete(key);if(attempts.size>1000)attempts.delete(attempts.keys().next().value!);}
 if(!await verifyAdminPassword(data.username,data.password,secrets))return errorResponse('Неверный логин или пароль',401);attempts.delete(address);const token=await createAdminSession(secrets);return Response.json({ok:true},{headers:{'Set-Cookie':adminCookie(token),'Cache-Control':'no-store'}});
 }catch(error){return errorResponse(error instanceof AdminBodyTooLarge?'Слишком большой запрос':'Не удалось выполнить вход',error instanceof AdminBodyTooLarge?413:400);}
}
