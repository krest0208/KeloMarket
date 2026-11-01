import {getSiteEditorSnapshot} from '@/lib/site-editor-server';
import {errorResponse,rawDb} from '@/lib/store-server';
export async function GET(){try{return Response.json(await getSiteEditorSnapshot(rawDb()),{headers:{'Cache-Control':'no-store'}});}catch{return errorResponse('Не удалось загрузить тексты сайта',503);}}
