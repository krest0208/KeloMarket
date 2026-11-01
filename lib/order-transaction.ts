interface Reservation {id:string;reference:string;createdAt:string;customer:string;items:string;subtotal:number;delivery:number|null;deliveryType:string;payment:string;token:string;needs:Map<string,number>;unitNeeds?:Map<string,number>;lengthNeeds?:Map<string,number>}
/** Tracked units reserve pieces; legacy rows reserve total centimetres. */
export async function reserveOrder(db:D1Database,order:Reservation){
 const {needs,unitNeeds=new Map<string,number>(),lengthNeeds=new Map<string,number>()}=order;
 const attempt=crypto.randomUUID();
 const clauses=[...needs].map(([id,cm])=>{const quantity=unitNeeds.get(id);if(quantity!==undefined){return '(SELECT stock_units>=? AND remaining_cm>=? FROM products WHERE id=? AND active=1)';}return '(SELECT remaining_cm FROM products WHERE id=? AND active=1 AND stock_units IS NULL)>=?';});
 // Bind parameters in the exact placeholder order of each independent product condition.
 const conditionArgs=[...needs].flatMap(([id,cm])=>unitNeeds.has(id)?[unitNeeds.get(id)!,lengthNeeds.get(id)??cm/unitNeeds.get(id)!,id]:[id,cm]);
 const insert=db.prepare(`INSERT OR IGNORE INTO orders(id,reference,created_at,customer,items,subtotal,delivery,delivery_type,payment,status,op_token) SELECT ?,?,?,?,?,?,?,?,?,'new',? WHERE ${clauses.join(' AND ')}`).bind(order.id,order.reference,order.createdAt,order.customer,order.items,order.subtotal,order.delivery,order.deliveryType,order.payment,attempt,...conditionArgs);
 const updates=[...needs].map(([id,cm])=>unitNeeds.has(id)?db.prepare('UPDATE products SET stock_units=stock_units-? WHERE id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND op_token=?)').bind(unitNeeds.get(id)!,id,order.id,attempt):db.prepare('UPDATE products SET remaining_cm=remaining_cm-? WHERE id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND op_token=?)').bind(cm,id,order.id,attempt));
 await db.batch([insert,...updates]);
 return db.prepare('SELECT reference, subtotal, delivery FROM orders WHERE id=?').bind(order.id).first();
}
export async function cancelOrder(db:D1Database,id:string,_token:string,needs:Map<string,number>,unitNeeds=new Map<string,number>()){
 const attempt=crypto.randomUUID();
 await db.batch([db.prepare("UPDATE orders SET status='cancelled',op_token=? WHERE id=? AND status NOT IN ('cancelled','completed')").bind(attempt,id),...[...needs].map(([productId,cm])=>unitNeeds.has(productId)?db.prepare('UPDATE products SET stock_units=stock_units+? WHERE id=? AND stock_units IS NOT NULL AND EXISTS(SELECT 1 FROM orders WHERE id=? AND op_token=?)').bind(unitNeeds.get(productId)!,productId,id,attempt):db.prepare('UPDATE products SET remaining_cm=MIN(max_length,remaining_cm+?) WHERE id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND op_token=?)').bind(cm,productId,id,attempt))]);
}
