import {rawDb} from '@/lib/store-server';
import {getSiteEditorSnapshot,saveSiteEditorSnapshot} from '@/lib/site-editor-server';
import {validEditorContent} from '@/lib/site-editor';

export async function getSiteContent(){return (await getSiteEditorSnapshot(rawDb())).content;}
export const validSiteContent=validEditorContent;
/** Legacy text-table saves invalidate any open visual draft as well. */
export async function saveSiteContent(input:Record<string,string>,expectedRevision?:number){
 const db=rawDb(),current=await getSiteEditorSnapshot(db);
 return saveSiteEditorSnapshot({content:input,layout:current.layout,expectedRevision:expectedRevision??current.revision},db);
}
