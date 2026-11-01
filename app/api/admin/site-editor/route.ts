import {AdminBodyTooLarge,readAdminJson} from '@/lib/admin-auth';
import {validSiteEditorSave} from '@/lib/site-editor';
import {getSiteEditorSnapshot,saveSiteEditorSnapshot} from '@/lib/site-editor-server';
import {errorResponse,isAdmin,rawDb,sameOrigin} from '@/lib/store-server';

export async function GET(req:Request){
 if(!await isAdmin(req))return errorResponse('Войдите в панель управления',401);
 try{return Response.json(await getSiteEditorSnapshot(rawDb()),{headers:{'Cache-Control':'no-store'}});}catch{return errorResponse('Не удалось загрузить редактор',503);}
}
export async function POST(req:Request){
 if(!await isAdmin(req))return errorResponse('Войдите в панель управления',401);
 if(!sameOrigin(req))return errorResponse('Нет доступа',403);
 try{
  const input=await readAdminJson(req,256000);
  if(!validSiteEditorSave(input))return errorResponse('Проверьте текст, изображения и блоки страницы');
  const result=await saveSiteEditorSnapshot(input,rawDb());
  if(!result)return errorResponse('Сайт уже изменён в другой вкладке. Обновите опубликованную версию перед сохранением.',409);
  return Response.json(result,{headers:{'Cache-Control':'no-store'}});
 }catch(error){return errorResponse(error instanceof AdminBodyTooLarge?'Слишком большой запрос':'Не удалось сохранить страницу. Попробуйте ещё раз.',error instanceof AdminBodyTooLarge?413:503);}
}
