import {DEFAULT_SITE_LAYOUT,normalizedEditorContent,validSiteLayout,validSiteEditorSave,type SiteEditorSnapshot,type SiteEditorSave} from './site-editor';

const parse=(value:string|undefined):unknown=>{try{return value?JSON.parse(value):null;}catch{return null;}};
/** Read both settings in one statement so copy and layout share a revision. */
export async function getSiteEditorSnapshot(db:D1Database):Promise<SiteEditorSnapshot>{
 const rows=await db.prepare("SELECT key,value FROM settings WHERE key IN ('site-content','site-editor')").all<{key:string;value:string}>();
 const editor=parse(rows.results.find(row=>row.key==='site-editor')?.value);
 const state=editor&&typeof editor==='object'?editor as {revision?:unknown;layout?:unknown}:{};
 return {content:normalizedEditorContent(parse(rows.results.find(row=>row.key==='site-content')?.value)),layout:validSiteLayout(state.layout)?state.layout:structuredClone(DEFAULT_SITE_LAYOUT),revision:Number.isSafeInteger(state.revision)&&Number(state.revision)>=0?Number(state.revision):0};
}
/** A unique write token guards the second statement when the CAS fails. */
export async function saveSiteEditorSnapshot(input:SiteEditorSave,db:D1Database):Promise<SiteEditorSnapshot|null>{
 if(!validSiteEditorSave(input))throw new Error('Invalid site editor data');
 const current=await getSiteEditorSnapshot(db);
 if(current.revision!==input.expectedRevision)return null;
 const next:SiteEditorSnapshot={content:{...current.content,...input.content},layout:structuredClone(input.layout),revision:current.revision+1};
 const token=crypto.randomUUID();
 const state=JSON.stringify({revision:next.revision,layout:next.layout,writeToken:token});
 const result=await db.batch([
  db.prepare("INSERT OR IGNORE INTO settings(key,value) VALUES('site-editor',?)").bind(JSON.stringify({revision:0,layout:DEFAULT_SITE_LAYOUT})),
  db.prepare("UPDATE settings SET value=? WHERE key='site-editor' AND COALESCE(json_extract(CASE WHEN json_valid(value) THEN value ELSE '{}' END,'$.revision'),0)=?").bind(state,input.expectedRevision),
  db.prepare("INSERT INTO settings(key,value) SELECT 'site-content',? WHERE EXISTS(SELECT 1 FROM settings WHERE key='site-editor' AND json_extract(value,'$.writeToken')=?) ON CONFLICT(key) DO UPDATE SET value=excluded.value").bind(JSON.stringify(next.content),token),
 ]);
 return result[1].meta.changes===1?next:null;
}
