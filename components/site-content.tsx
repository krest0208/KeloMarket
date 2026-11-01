'use client';

import {createContext, useCallback, useContext, useEffect, useState, type ReactNode} from 'react';
import {DEFAULT_SITE_CONTENT, siteContentKey} from '@/lib/site-content';

const ContentContext=createContext<Record<string,string>>(DEFAULT_SITE_CONTENT);
export function SiteContentProvider({children}:{children:ReactNode}){
  const [content,setContent]=useState(DEFAULT_SITE_CONTENT);
  const reload=useCallback(async()=>{
    try{const response=await fetch('/api/site-content',{cache:'no-store'});if(!response.ok)return;const data=await response.json() as {content?:Record<string,string>};if(data.content)setContent({...DEFAULT_SITE_CONTENT,...data.content});}catch{/* Default copy remains readable during a connection failure. */}
  },[]);
  useEffect(()=>{void reload();window.addEventListener('kelo-content-updated',reload);return()=>window.removeEventListener('kelo-content-updated',reload);},[reload]);
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
export function SiteText({text}:{text:ReactNode}){
  const content=useContext(ContentContext);
  if(typeof text!=='string')return <>{text}</>;
  return <>{content[siteContentKey(text)]??text}</>;
}
