export const ADMIN_COOKIE = 'kelo_admin_session';
export const ADMIN_SESSION_SECONDS = 4 * 60 * 60;
export interface AdminSecrets {ADMIN_USERNAME?: string; ADMIN_PASSWORD_HASH?: string; ADMIN_SESSION_SECRET?: string}
const encoder = new TextEncoder();
const base64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
function bytes(value: string) {if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error('Invalid encoding');return Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4-value.length%4)%4)), c=>c.charCodeAt(0));}
export function adminConfigured(env: AdminSecrets) {return !!env.ADMIN_USERNAME && !!env.ADMIN_PASSWORD_HASH && (env.ADMIN_SESSION_SECRET?.length || 0)>=32;}
export async function verifyAdminPassword(username:string, password:string, env:AdminSecrets) {
 if(!adminConfigured(env)||username.length>100||password.length>200)return false;
 try {const [algorithm,rounds,salt,digest]=env.ADMIN_PASSWORD_HASH!.split('$');const iterations=Number(rounds);if(algorithm!=='pbkdf2-sha256'||iterations<100000||iterations>1000000)return false;
 const saltBytes=bytes(salt),expected=bytes(digest);if(saltBytes.length<16||expected.length!==32)return false;
 const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);
 const derived=new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:saltBytes,iterations},key,256));let mismatch=0;for(let i=0;i<32;i++)mismatch|=derived[i]^expected[i];return mismatch===0&&username===env.ADMIN_USERNAME;
 } catch {return false;}
}
async function signingKey(secret:string){return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
export async function createAdminSession(env:AdminSecrets,now=Date.now()) {
 if(!adminConfigured(env))throw new Error('Admin authentication is not configured');
 const payload=base64url(encoder.encode(JSON.stringify({username:env.ADMIN_USERNAME,exp:Math.floor(now/1000)+ADMIN_SESSION_SECONDS,nonce:crypto.randomUUID()})));
 const signature=await crypto.subtle.sign('HMAC',await signingKey(env.ADMIN_SESSION_SECRET!),encoder.encode(payload));return payload+'.'+base64url(new Uint8Array(signature));
}
export async function validAdminSession(token:string|undefined,env:AdminSecrets,now=Date.now()) {
 if(!token||token.length>2048||!adminConfigured(env))return false;
 try {const [payload,signature,...rest]=token.split('.');if(rest.length||!payload||!signature)return false;const valid=await crypto.subtle.verify('HMAC',await signingKey(env.ADMIN_SESSION_SECRET!),bytes(signature),encoder.encode(payload));if(!valid)return false;const data=JSON.parse(new TextDecoder().decode(bytes(payload)));const seconds=Math.floor(now/1000);return data.username===env.ADMIN_USERNAME&&Number.isInteger(data.exp)&&data.exp>seconds&&data.exp<=seconds+ADMIN_SESSION_SECONDS;}catch{return false;}
}
export function adminCookie(token:string,maxAge=ADMIN_SESSION_SECONDS){return `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;}
export function requestSession(req:Request){return req.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(ADMIN_COOKIE+'='))?.slice(ADMIN_COOKIE.length+1);}
export class AdminBodyTooLarge extends Error {}
export async function readAdminJson(req:Request,limit:number):Promise<unknown>{
 if(Number(req.headers.get('content-length')||0)>limit)throw new AdminBodyTooLarge();
 if(!req.body)throw new Error('Empty body');const reader=req.body.getReader();const chunks:Uint8Array[]=[];let size=0;
 try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();throw new AdminBodyTooLarge();}chunks.push(value);}}finally{reader.releaseLock();}
 const all=new Uint8Array(size);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.length;}return JSON.parse(new TextDecoder().decode(all));
}
