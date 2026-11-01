import {getSiteContent} from '@/lib/site-content-server';
import {errorResponse} from '@/lib/store-server';
export async function GET(){try{return Response.json({content:await getSiteContent()},{headers:{'Cache-Control':'no-store'}});}catch{return errorResponse('Не удалось загрузить тексты сайта',503);}}
