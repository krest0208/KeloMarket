import {eq} from 'drizzle-orm';
import {getDb} from '@/db';
import {settings} from '@/db/schema';
import {DEFAULT_SITE_CONTENT,SITE_CONTENT_FIELDS} from '@/lib/site-content';
export async function getSiteContent(){const row=(await getDb().select().from(settings).where(eq(settings.key,'site-content')))[0];const content:Record<string,string>={...DEFAULT_SITE_CONTENT};if(row){try{const saved=JSON.parse(row.value);for(const field of SITE_CONTENT_FIELDS)if(typeof saved[field.key]==='string'&&saved[field.key].length<=4000)content[field.key]=saved[field.key];}catch{}}return content;}
export function validSiteContent(input:unknown):input is Record<string,string>{if(!input||typeof input!=='object'||Array.isArray(input))return false;const entries=Object.entries(input);const allowed=new Set(SITE_CONTENT_FIELDS.map(f=>f.key));return entries.length<=SITE_CONTENT_FIELDS.length&&entries.every(([key,value])=>allowed.has(key)&&typeof value==='string'&&value.trim().length>0&&value.length<=4000);}
export async function saveSiteContent(input:Record<string,string>){const content={...await getSiteContent(),...input};await getDb().insert(settings).values({key:'site-content',value:JSON.stringify(content)}).onConflictDoUpdate({target:settings.key,set:{value:JSON.stringify(content)}});}
