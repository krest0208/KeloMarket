import {adminCookie} from '@/lib/admin-auth';
import {sameOrigin,errorResponse} from '@/lib/store-server';
export async function POST(req:Request){if(!sameOrigin(req))return errorResponse('Недопустимый источник запроса',403);return Response.json({ok:true},{headers:{'Set-Cookie':adminCookie('',0),'Cache-Control':'no-store'}});}
