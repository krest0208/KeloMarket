import { getCatalog, errorResponse } from '@/lib/store-server';
export async function GET(){try {return Response.json(await getCatalog(),{headers:{'Cache-Control':'no-store'}});}catch{return errorResponse('Не удалось загрузить каталог. Попробуйте ещё раз.',503);}}
