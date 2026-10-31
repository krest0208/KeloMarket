import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { products, settings } from '@/db/schema';
import { demoProducts, defaultProcessing, type Processing } from '@/lib/catalog';

export function rawDb(){if(!env.DB)throw new Error('Хранилище временно недоступно');return env.DB;}
export async function ensureSeed(){const db=getDb();await db.insert(products).values(demoProducts).onConflictDoNothing();await db.insert(settings).values({key:'processing',value:JSON.stringify(defaultProcessing)}).onConflictDoNothing();}
export async function getCatalog(){await ensureSeed();const db=getDb();const [list,config]=await Promise.all([db.select().from(products),db.select().from(settings).where(eq(settings.key,'processing'))]);return {products:list,processing:config[0]?JSON.parse(config[0].value) as Processing:defaultProcessing};}
export function isAdmin(req:Request){return import.meta.env.DEV || !!req.headers.get('oai-authenticated-user-id');}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');return !origin||origin===new URL(req.url).origin;}
export function errorResponse(message:string,status=400){return Response.json({error:message},{status});}
