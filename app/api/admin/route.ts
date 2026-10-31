import { cancelOrder } from '@/lib/order-transaction';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { products, settings, orders } from '@/db/schema';
import { getCatalog, rawDb, isAdmin, sameOrigin, errorResponse } from '@/lib/store-server';
import { categories, statuses, type CartItem } from '@/lib/catalog';
const productSchema=z.object({id:z.string().regex(/^[A-Za-z0-9-]{2,30}$/),name:z.string().trim().min(2).max(100),category:z.string().refine(v=>categories.some(c=>c.id===v)),description:z.string().trim().min(5).max(2000),image:z.string().refine(v=>/^\/(images\/[a-z0-9-]+\.webp|api\/images\/[a-zA-Z0-9.-]+)$/.test(v)),maxLength:z.number().int().min(30).max(600),width:z.number().int().min(10).max(100),thickness:z.union([z.literal(30),z.literal(40)]),rate:z.number().int().min(100).max(1000000),remainingCm:z.number().int().min(0).max(600),active:z.union([z.literal(0),z.literal(1)])}).refine(p=>p.remainingCm<=p.maxLength,{message:'Остаток не может превышать длину доски'});
export async function GET(req:Request){if(!isAdmin(req))return errorResponse('Требуется доступ владельца сайта',401);try{const catalog=await getCatalog();const all=await getDb().select().from(orders);return Response.json({...catalog,orders:all.sort((a,b)=>b.createdAt.localeCompare(a.createdAt))},{headers:{'Cache-Control':'no-store'}});}catch{return errorResponse('Не удалось загрузить данные',503);}}
export async function POST(req:Request){
 if(!isAdmin(req)||!sameOrigin(req))return errorResponse('Нет доступа',403);
 try{const body=z.object({action:z.string(),product:z.unknown().optional(),processing:z.unknown().optional(),id:z.string().optional(),status:z.string().optional()}).parse(await req.json());const db=getDb();
 if(body.action==='product'){const p=productSchema.safeParse(body.product);if(!p.success)return errorResponse(p.error.issues[0]?.message||'Проверьте параметры товара');await db.insert(products).values(p.data).onConflictDoUpdate({target:products.id,set:p.data});return Response.json({ok:true});}
 if(body.action==='processing'){const s=z.object({sanding:z.number().int().min(0).max(100000),cut:z.number().int().min(0).max(100000),hole:z.number().int().min(0).max(100000),shelf:z.number().int().min(0).max(100000)}).safeParse(body.processing);if(!s.success)return errorResponse('Проверьте стоимость обработки');await db.insert(settings).values({key:'processing',value:JSON.stringify(s.data)}).onConflictDoUpdate({target:settings.key,set:{value:JSON.stringify(s.data)}});return Response.json({ok:true});}
 if(body.action==='status'&&typeof body.id==='string'&&typeof body.status==='string'&&statuses[body.status]){const current=(await db.select().from(orders).where(eq(orders.id,body.id)))[0];if(!current)return errorResponse('Заказ не найден',404);if(current.status==='cancelled'||current.status==='completed')return errorResponse('Завершённый или отменённый заказ нельзя изменить');
 if(body.status==='cancelled'){const token=crypto.randomUUID();const needs=new Map<string,number>();for(const item of JSON.parse(current.items) as CartItem[])needs.set(item.product.id,(needs.get(item.product.id)||0)+item.config.length*item.quantity);await cancelOrder(rawDb(),body.id,token,needs);}
 else await db.update(orders).set({status:body.status}).where(eq(orders.id,body.id));return Response.json({ok:true});}
 return errorResponse('Неизвестное действие');
 }catch{return errorResponse('Изменения не сохранены. Попробуйте ещё раз.',503);}
}
