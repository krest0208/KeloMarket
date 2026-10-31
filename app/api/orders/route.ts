import { reserveOrder } from '@/lib/order-transaction';
import { z } from 'zod';
import { getCatalog, rawDb, errorResponse, sameOrigin } from '@/lib/store-server';
import { priceDetails, shipping, configurationError, type CartItem } from '@/lib/catalog';
const input=z.object({requestId:z.string().uuid(),customer:z.object({name:z.string().trim().min(2).max(100),phone:z.string().regex(/^\+?[\d\s()\-]{10,22}$/).refine(v=>v.replace(/\D/g,'').length>=10&&v.replace(/\D/g,'').length<=15),email:z.union([z.string().email(),z.literal('')]),city:z.string().max(100),address:z.string().max(400),comment:z.string().max(1500)}),deliveryType:z.enum(['pickup','delivery']),payment:z.enum(['online-demo','agreement']),consent:z.literal(true),items:z.array(z.object({quantity:z.number().int().min(1).max(20),config:z.object({productId:z.string().max(50),type:z.enum(['slab','shelf','blank']),length:z.number().int().min(30).max(600),width:z.number().int().min(10).max(100).optional(),thickness:z.union([z.literal(30),z.literal(40)]),sanding:z.boolean(),cut:z.boolean(),side:z.enum(['left','right']),holes:z.union([z.literal(0),z.literal(2),z.literal(3)]),mode:z.enum(['board','product']).optional(),supports:z.boolean().optional(),giftWrap:z.boolean().optional()})})).min(1).max(30)});
export async function POST(req:Request){
  if(!sameOrigin(req))return errorResponse('Недопустимый источник запроса',403);
  try{
    const parsed=input.safeParse(await req.json());if(!parsed.success)return errorResponse('Проверьте контактные данные и параметры заказа.');
    const body=parsed.data;
    if(body.deliveryType==='delivery'&&(!body.customer.city.trim()||!body.customer.address.trim()))return errorResponse('Укажите город и адрес доставки.');
    const db=rawDb();const existing=await db.prepare('SELECT reference, subtotal, delivery FROM orders WHERE id=?').bind(body.requestId).first();if(existing)return Response.json({order:existing});
    const catalog=await getCatalog();const items:CartItem[]=[];const needs=new Map<string,number>();
    for(const line of body.items){const p=catalog.products.find(p=>p.id===line.config.productId&&p.active);const c=line.config;if(!p)return errorResponse('Товар недоступен. Обновите каталог.',409);const invalid=configurationError(p,c);if(invalid)return errorResponse(invalid,409);const price=priceDetails(p,c,catalog.processing).total;items.push({key:crypto.randomUUID(),product:p,config:c,quantity:line.quantity,price});needs.set(p.id,(needs.get(p.id)||0)+c.length*line.quantity);}
    for(const [id,cm] of needs){if(catalog.products.find(p=>p.id===id)!.remainingCm<cm)return errorResponse(`Для ${id} недостаточно материала. Уменьшите длину или количество.`,409);}
    const subtotal=items.reduce((s,i)=>s+i.price*i.quantity,0);const delivery=shipping(items,body.deliveryType);const token=crypto.randomUUID();const ref='KW-'+Date.now().toString(36).slice(-6).toUpperCase();
    const order=await reserveOrder(db,{id:body.requestId,reference:ref,createdAt:new Date().toISOString(),customer:JSON.stringify(body.customer),items:JSON.stringify(items),subtotal,delivery,deliveryType:body.deliveryType,payment:body.payment,token,needs});
    if(!order)return errorResponse('Доска уже зарезервирована. Обновите каталог и выберите другую.',409);
    return Response.json({order},{status:201});
  }catch{return errorResponse('Не удалось сохранить заказ. Корзина сохранена — попробуйте ещё раз.',503);}
}
