interface Reservation {id:string;reference:string;createdAt:string;customer:string;items:string;subtotal:number;delivery:number|null;deliveryType:string;payment:string;token:string;needs:Map<string,number>}
export async function reserveOrder(db:D1Database,order:Reservation){
 const {needs}=order;
 const clauses=[...needs].map(()=>'(SELECT remaining_cm FROM products WHERE id=? AND active=1)>=?').join(' AND ');
 const insert=db.prepare(`INSERT OR IGNORE INTO orders(id,reference,created_at,customer,items,subtotal,delivery,delivery_type,payment,status,op_token) SELECT ?,?,?,?,?,?,?,?,?,'new',? WHERE ${clauses}`).bind(order.id,order.reference,order.createdAt,order.customer,order.items,order.subtotal,order.delivery,order.deliveryType,order.payment,order.token,...[...needs].flatMap(([id,cm])=>[id,cm]));
 const updates=[...needs].map(([id,cm])=>db.prepare('UPDATE products SET remaining_cm=remaining_cm-? WHERE id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND op_token=?)').bind(cm,id,order.id,order.token));
 await db.batch([insert,...updates]);
 return db.prepare('SELECT reference, subtotal, delivery FROM orders WHERE id=?').bind(order.id).first();
}
export async function cancelOrder(db:D1Database,id:string,token:string,needs:Map<string,number>){
 await db.batch([db.prepare("UPDATE orders SET status='cancelled',op_token=? WHERE id=? AND status NOT IN ('cancelled','completed')").bind(token,id),...[...needs].map(([productId,cm])=>db.prepare('UPDATE products SET remaining_cm=MIN(max_length,remaining_cm+?) WHERE id=? AND EXISTS(SELECT 1 FROM orders WHERE id=? AND op_token=?)').bind(cm,productId,id,token))]);
}
