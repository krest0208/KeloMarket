import {DEFAULT_SITE_CONTENT,SITE_CONTENT_FIELDS} from './site-content';

export const HOME_BLOCKS=[
 {id:'hero',label:'Первый экран'},
 {id:'highlights',label:'Характер. В деталях'},
 {id:'board',label:'Доска Кело'},
 {id:'products',label:'Изделия'},
 {id:'additional-products',label:'Новые изделия'},
 {id:'about',label:'О древесине Кело'},
 {id:'ideas',label:'Идеи для дома'},
 {id:'steps',label:'Как заказать'},
 {id:'delivery',label:'Доставка и оплата'},
 {id:'contacts',label:'Контакты и заказ'},
] as const;
export type HomeBlockId=typeof HOME_BLOCKS[number]['id'];
export interface BuiltinBlock {id:HomeBlockId;type:'builtin';hidden:boolean}
export interface CustomBlock {id:string;type:'text'|'image';hidden:boolean;title:string;text:string;image:string;alt:string;theme:'dark'|'wood';align:'left'|'center'}
export type SiteBlock=BuiltinBlock|CustomBlock;
export interface SiteLayout {blocks:SiteBlock[]}
export interface SiteEditorSnapshot {content:Record<string,string>;layout:SiteLayout;revision:number}
export interface SiteEditorSave {content:Record<string,string>;layout:SiteLayout;expectedRevision:number}
export const DEFAULT_SITE_LAYOUT:SiteLayout={blocks:HOME_BLOCKS.map(({id})=>({id,type:'builtin',hidden:false}))};
export const MAX_CUSTOM_BLOCKS=20;
const allowedContent=new Set(SITE_CONTENT_FIELDS.map(field=>field.key));
const homeIds=new Set<string>(HOME_BLOCKS.map(block=>block.id));
const record=(input:unknown):input is Record<string,unknown>=>!!input&&typeof input==='object'&&!Array.isArray(input);
const boundedText=(value:unknown,max:number):value is string=>typeof value==='string'&&value.length<=max&&!value.includes('\u0000');
export function safeEditorImage(input:unknown):input is string {
 return typeof input==='string'&&input.length<=240&&!input.includes('..')&&/^\/(?:images\/[A-Za-z0-9/_-]+\.webp|api\/images\/[A-Za-z0-9][A-Za-z0-9_-]*\.(?:webp|png|jpe?g))$/.test(input);
}
/** Only registered plain-text keys can enter the site's copy store. */
export function validEditorContent(input:unknown):input is Record<string,string>{
 if(!record(input))return false;
 const entries=Object.entries(input);
 return entries.length<=SITE_CONTENT_FIELDS.length&&entries.every(([key,value])=>allowedContent.has(key)&&boundedText(value,4000)&&value.trim().length>0);
}
/** Every built-in block remains represented, even when the owner hides it. */
export function validSiteLayout(input:unknown):input is SiteLayout {
 if(!record(input)||Object.keys(input).some(key=>key!=='blocks')||!Array.isArray(input.blocks)||input.blocks.length<HOME_BLOCKS.length||input.blocks.length>HOME_BLOCKS.length+MAX_CUSTOM_BLOCKS)return false;
 const ids=new Set<string>(),builtins=new Set<string>();
 for(const item of input.blocks){
  if(!record(item)||typeof item.id!=='string'||ids.has(item.id)||typeof item.hidden!=='boolean')return false;
  ids.add(item.id);
  if(item.type==='builtin'){
   if(!homeIds.has(item.id)||Object.keys(item).some(key=>!['id','type','hidden'].includes(key)))return false;
   builtins.add(item.id);continue;
  }
  if(!['text','image'].includes(String(item.type))||!/^custom-[A-Za-z0-9-]{1,64}$/.test(item.id)||Object.keys(item).some(key=>!['id','type','hidden','title','text','image','alt','theme','align'].includes(key)))return false;
  if(!boundedText(item.title,160)||!boundedText(item.text,4000)||!boundedText(item.alt,240)||!['dark','wood'].includes(String(item.theme))||!['left','center'].includes(String(item.align)))return false;
  if(item.type==='image'){
   if(!safeEditorImage(item.image)||!item.alt.trim())return false;
  }else if(item.image!==''||(!item.title.trim()&&!item.text.trim()))return false;
 }
 return builtins.size===HOME_BLOCKS.length;
}
export function validSiteEditorSave(input:unknown):input is SiteEditorSave {
 return record(input)&&Number.isSafeInteger(input.expectedRevision)&&Number(input.expectedRevision)>=0&&Number(input.expectedRevision)<Number.MAX_SAFE_INTEGER&&validEditorContent(input.content)&&validSiteLayout(input.layout);
}
export function normalizedEditorContent(input:unknown):Record<string,string>{
 const result={...DEFAULT_SITE_CONTENT};
 if(record(input))for(const field of SITE_CONTENT_FIELDS){const value=input[field.key];if(boundedText(value,4000)&&value.trim())result[field.key]=value;}
 return result;
}
