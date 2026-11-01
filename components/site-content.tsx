'use client';

import {createContext,useCallback,useContext,useEffect,useLayoutEffect,useRef,useState,type ReactNode} from 'react';
import {DEFAULT_SITE_CONTENT,SITE_CONTENT_FIELDS,siteContentKey} from '@/lib/site-content';
import {DEFAULT_SITE_LAYOUT,validEditorContent,validSiteLayout,type SiteLayout,type SiteEditorSnapshot} from '@/lib/site-editor';

type FrameState={channel:string;enabled:boolean;mode:'edit'|'preview';selectedKey?:string;selectedBlock?:string};
type ContentState={content:Record<string,string>;layout:SiteLayout;frame:FrameState;send:(type:string,data?:Record<string,unknown>)=>void;change:(key:string,value:string)=>void};
const initialFrame:FrameState={channel:'',enabled:false,mode:'preview'};
const fieldMap=new Map(SITE_CONTENT_FIELDS.map(field=>[field.key,field]));
const ContentContext=createContext<ContentState>({content:DEFAULT_SITE_CONTENT,layout:DEFAULT_SITE_LAYOUT,frame:initialFrame,send:()=>{},change:()=>{}});
export const useSiteContent=()=>useContext(ContentContext);

export function SiteContentProvider({children}:{children:ReactNode}){
 const [content,setContent]=useState(DEFAULT_SITE_CONTENT),[layout,setLayout]=useState(DEFAULT_SITE_LAYOUT),[frame,setFrame]=useState<FrameState>(initialFrame);
 const frameRef=useRef(frame);frameRef.current=frame;
 const send=useCallback((type:string,data:Record<string,unknown>={})=>{
  const current=frameRef.current;if(current.enabled&&window.parent!==window)window.parent.postMessage({type,channel:current.channel,...data},window.location.origin);
 },[]);
 const change=useCallback((key:string,value:string)=>{setContent(previous=>({...previous,[key]:value}));send('kelo-editor:change',{key,value});},[send]);
 const reload=useCallback(async()=>{
  if(frameRef.current.enabled)return;
  try{const response=await fetch('/api/site-content',{cache:'no-store'});if(!response.ok)return;const data=await response.json() as SiteEditorSnapshot;if(frameRef.current.enabled)return;if(data.content)setContent({...DEFAULT_SITE_CONTENT,...data.content});if(validSiteLayout(data.layout))setLayout(data.layout);}catch{/* Keep the source defaults usable offline. */}
 },[]);
 useEffect(()=>{void reload();window.addEventListener('kelo-content-updated',reload);return()=>window.removeEventListener('kelo-content-updated',reload);},[reload]);
 useEffect(()=>{
  const query=new URLSearchParams(window.location.search),channel=query.get('channel');
  if(window.parent===window||query.get('kelo-editor')!=='1'||!channel||!/^[-a-zA-Z0-9]{16,80}$/.test(channel))return;
  let disposed=false;
  // A URL flag never grants editing: the iframe must have the real admin session.
  void fetch('/api/admin/site-editor',{cache:'no-store'}).then(response=>{
   if(disposed)return;
   if(!response.ok){window.parent.postMessage({type:'kelo-editor:error',channel,message:response.status===401?'Сессия администратора закончилась. Войдите в админку снова.':'Не удалось подключить страницу редактора.'},window.location.origin);return;}
   const next:FrameState={channel,enabled:true,mode:'edit'};frameRef.current=next;setFrame(next);
   window.parent.postMessage({type:'kelo-editor:ready',channel},window.location.origin);
  }).catch(()=>{if(!disposed)window.parent.postMessage({type:'kelo-editor:error',channel,message:'Не удалось подключить страницу. Проверьте соединение и повторите загрузку.'},window.location.origin);});
  const receive=(event:MessageEvent)=>{
   if(!frameRef.current.enabled||event.origin!==window.location.origin||event.source!==window.parent||!event.data||event.data.channel!==channel)return;
   const data=event.data;
   if(data.type==='kelo-editor:state'&&validEditorContent(data.content)&&validSiteLayout(data.layout)&&(data.mode==='edit'||data.mode==='preview')){
    setContent({...DEFAULT_SITE_CONTENT,...data.content});setLayout(data.layout);
    setFrame(previous=>({...previous,mode:data.mode,selectedKey:typeof data.selectedKey==='string'?data.selectedKey:undefined,selectedBlock:typeof data.selectedBlock==='string'?data.selectedBlock:undefined}));
   }else if(data.type==='kelo-editor:focus'){
    requestAnimationFrame(()=>{
     const key=typeof data.key==='string'?data.key:null,block=typeof data.blockId==='string'?data.blockId:null;
     const element=key?Array.from(document.querySelectorAll<HTMLElement>('[data-site-copy]')).find(el=>el.dataset.siteCopy===key):block?Array.from(document.querySelectorAll<HTMLElement>('[data-site-block]')).find(el=>el.dataset.siteBlock===block):undefined;
     const visible=element?.classList.contains('kelo-page-block')?element.firstElementChild as HTMLElement|null:element;
     visible?.scrollIntoView({block:'center',behavior:'instant'});
     if(key)element?.focus({preventScroll:true});
    });
   }
  };
  window.addEventListener('message',receive);return()=>{disposed=true;window.removeEventListener('message',receive);};
 },[]);
 useEffect(()=>{
  if(!frame.enabled)return;
  document.documentElement.classList.toggle('kelo-edit-frame',frame.mode==='edit');
  const click=(event:MouseEvent)=>{
   const target=event.target instanceof Element?event.target:null;if(!target)return;
   const anchor=target.closest<HTMLAnchorElement>('a[href]');
   if(frameRef.current.mode==='preview'){
    if(anchor){event.preventDefault();event.stopPropagation();const url=new URL(anchor.href,window.location.origin);if(url.origin===window.location.origin){if(url.pathname===window.location.pathname&&url.hash){document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({block:'start'});}else if(['/','/catalog','/products','/account','/constructor','/product/PL-001','/product/PD-001'].includes(url.pathname))send('kelo-editor:navigate',{path:url.pathname});}}
    return;
   }
   const blockId=target.closest<HTMLElement>('[data-site-block]')?.dataset.siteBlock;
   const copy=target.closest<HTMLElement>('[data-site-copy]');
   if(copy){send('kelo-editor:select',{key:copy.dataset.siteCopy,blockId});if(target.closest('a,button,summary'))event.preventDefault();event.stopPropagation();copy.focus({preventScroll:true});return;}
   if(blockId)send('kelo-editor:block',{blockId});
   // Selecting a block must not add products, navigate away, or submit a review.
   if(target.closest('a,button,input,select,textarea,summary')){event.preventDefault();event.stopPropagation();}
  };
  const submit=(event:Event)=>{event.preventDefault();event.stopImmediatePropagation();};
  document.addEventListener('click',click,true);document.addEventListener('submit',submit,true);
  return()=>{document.documentElement.classList.remove('kelo-edit-frame');document.removeEventListener('click',click,true);document.removeEventListener('submit',submit,true);};
 },[frame.enabled,frame.mode,send]);
 return <ContentContext.Provider value={{content,layout,frame,send,change}}>{children}</ContentContext.Provider>;
}

function EditableCopy({value,label,onChange,selected,multiline=false,copyKey,customField,maxLength=4000}:{value:string;label:string;onChange:(value:string)=>void;selected:boolean;multiline?:boolean;copyKey?:string;customField?:string;maxLength?:number}){
 const ref=useRef<HTMLSpanElement>(null),original=useRef(value),composing=useRef(false);
 useLayoutEffect(()=>{if(ref.current&&(!document.hasFocus()||document.activeElement!==ref.current)&&ref.current.textContent!==value)ref.current.textContent=value;},[value]);
 const input=()=>{if(!composing.current){const raw=ref.current?.innerText||'',next=raw.slice(0,maxLength);if(ref.current&&raw.length>maxLength)ref.current.textContent=next;onChange(next);}};
 return <span ref={ref} data-site-copy={copyKey} data-custom-field={customField} className={'kelo-edit-copy'+(selected?' is-selected':'')} contentEditable="plaintext-only" suppressContentEditableWarning role="textbox" aria-label={label} aria-multiline={multiline} tabIndex={0} spellCheck
  onFocus={()=>{original.current=ref.current?.innerText||'';}}
  onInput={input} onCompositionStart={()=>{composing.current=true;}} onCompositionEnd={()=>{composing.current=false;input();}}
  onBlur={input}
  onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();if(ref.current)ref.current.textContent=original.current;onChange(original.current);ref.current?.blur();}else if(event.key==='Enter'&&(!multiline||event.ctrlKey||event.metaKey)){event.preventDefault();ref.current?.blur();}}}
  onPaste={event=>{event.preventDefault();const text=event.clipboardData.getData('text/plain').replaceAll('\u0000','');const selection=window.getSelection();if(!selection?.rangeCount)return;const range=selection.getRangeAt(0);if(!ref.current?.contains(range.commonAncestorContainer))return;range.deleteContents();const node=document.createTextNode(text);range.insertNode(node);range.setStartAfter(node);range.collapse(true);selection.removeAllRanges();selection.addRange(range);input();}}
 />;
}

export function SiteText({text}:{text:ReactNode}){
 const {content,frame,change,send}=useSiteContent();
 if(typeof text!=='string')return <>{text}</>;
 const key=siteContentKey(text),field=fieldMap.get(key),value=content[key]??text;
 if(!frame.enabled||frame.mode!=='edit'||!field)return <>{value}</>;
 return <EditableCopy value={value} label={field.label} copyKey={key} multiline={field.multiline} selected={frame.selectedKey===key} onChange={next=>{change(key,next);send('kelo-editor:select',{key});}}/>;
}

export function CustomBlockText({blockId,field,value}:{blockId:string;field:'title'|'text';value:string}){
 const {frame,send}=useSiteContent();
 if(!frame.enabled||frame.mode!=='edit')return <>{value}</>;
 return <EditableCopy value={value} label={field==='title'?'Заголовок блока':'Текст блока'} multiline={field==='text'} customField={field} maxLength={field==='title'?160:4000} selected={frame.selectedBlock===blockId} onChange={next=>send('kelo-editor:custom-change',{blockId,field,value:next})}/>;
}
