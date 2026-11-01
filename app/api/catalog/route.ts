import {getCatalog,errorResponse} from '@/lib/store-server';
import {publicProduct} from '@/lib/catalog';
export async function GET(){try{const catalog=await getCatalog();return Response.json({...catalog,products:catalog.products.filter(p=>p.active).map(publicProduct)},{headers:{'Cache-Control':'no-store'}});}catch{return errorResponse('Не удалось загрузить каталог. Попробуйте ещё раз.',503);}}
