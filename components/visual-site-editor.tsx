'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import {ArrowDown,ArrowUp,Check,Eye,EyeOff,FileText,Image as ImageIcon,Layers,Loader2,Monitor,MousePointer2,Plus,Redo2,RotateCcw,Save,Smartphone,Trash2,Undo2,Upload,X} from 'lucide-react';
import {SITE_CONTENT_FIELDS} from '@/lib/site-content';
import {HOME_BLOCKS,MAX_CUSTOM_BLOCKS,type SiteEditorSnapshot,type SiteLayout} from '@/lib/site-editor';

type Draft=Pick<SiteEditorSnapshot,'content'|'layout'>;
type Block=SiteLayout['blocks'][number];
type CustomBlock=Exclude<Block,{type:'builtin'}>;
type History={past:Draft[];present:Draft;future:Draft[]};
const PAGES=[['/','Главная'],['/catalog','Доска Кело'],['/products','Изделия'],['/account','Аккаунт покупателя'],['/constructor','Конструктор'],['/product/PL-001','Карточка полки'],['/product/PD-001','Карточка подоконника']];
const fieldMap=new Map(SITE_CONTENT_FIELDS.map(field=>[field.key,field]));
const clone=<T,>(value:T):T=>JSON.parse(JSON.stringify(value)) as T;
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b);
const draftOf=(snapshot:SiteEditorSnapshot):Draft=>({content:{...snapshot.content},layout:clone(snapshot.layout)});
const blockLabel=(block:Block)=>block.type==='builtin'?HOME_BLOCKS.find(item=>item.id===block.id)?.label||block.id:block.title|| (block.type==='image'?'Новый блок с фото':'Новый текстовый блок');

export function VisualSiteEditor({onClose}:{onClose:()=>void}){
 const [history,setHistory]=useState<History|null>(null),[saved,setSaved]=useState<Draft|null>(null),[revision,setRevision]=useState(0);
 const [loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[uploading,setUploading]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[conflict,setConflict]=useState(false);
 const [page,setPage]=useState('/'),[viewport,setViewport]=useState<'desktop'|'mobile'>('desktop'),[mode,setMode]=useState<'edit'|'preview'>('edit'),[panel,setPanel]=useState<'blocks'|'texts'>('blocks');
 const [selectedKey,setSelectedKey]=useState<string>(),[selectedBlock,setSelectedBlock]=useState<string>(),[search,setSearch]=useState(''),[ready,setReady]=useState(false),[reloadToken,setReloadToken]=useState(0),[channel,setChannel]=useState(''),[phoneScale,setPhoneScale]=useState(1),[frameError,setFrameError]=useState(false),[frameMessage,setFrameMessage]=useState('');
 const editorDialog=useRef<HTMLDialogElement>(null),frame=useRef<HTMLIFrameElement>(null),pendingFocus=useRef<{key?:string;blockId?:string}|null>(null),canvas=useRef<HTMLDivElement>(null),latest=useRef({history,mode,selectedKey,selectedBlock,busy,uploading,page}),lastEdit=useRef({key:'',at:0});
 latest.current={history,mode,selectedKey,selectedBlock,busy,uploading,page};
 const draft=history?.present,dirty=!!draft&&!!saved&&!same(draft,saved),locked=busy||uploading;
 const selectedField=selectedKey?fieldMap.get(selectedKey):undefined;
 const block=draft?.layout.blocks.find(item=>item.id===selectedBlock),custom=block&&block.type!=='builtin'?block:undefined;
 const invalidFields=draft?Object.entries(draft.content).filter(([key,value])=>fieldMap.has(key)&&(!value.trim()||value.length>4000)):[];
 const invalidCustom=draft?.layout.blocks.find(item=>item.type!=='builtin'&&(!item.title.trim()||!item.text.trim()||(item.type==='image'&&(!item.image||!item.alt.trim()))));
 const validation=invalidFields.length?'Заполните выбранные тексты: пустые поля сохранить нельзя.':invalidCustom?'Заполните заголовок и текст новых блоков, а у фотографии — изображение и его описание.':'';

 const load=useCallback(async()=>{
  setLoading(true);setError('');setNotice('');setConflict(false);
  try{const response=await fetch('/api/admin/site-editor',{cache:'no-store'});const data=await response.json() as SiteEditorSnapshot&{error?:string};if(!response.ok)throw new Error(response.status===401?'Сессия закончилась. Закройте редактор и войдите в админку снова.':data.error||'Не удалось открыть редактор.');const next=draftOf(data);setHistory({past:[],present:next,future:[]});setSaved(clone(next));setRevision(data.revision);setReady(false);setReloadToken(value=>value+1);setSelectedKey(undefined);setSelectedBlock(undefined);}
  catch(cause){setError(cause instanceof Error?cause.message:'Не удалось загрузить сайт.');}finally{setLoading(false);}
 },[]);
 useEffect(()=>{setChannel(crypto.randomUUID());void load();},[load]);
 useEffect(()=>{const dialog=editorDialog.current;dialog?.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;dialog?.close();};},[]);
 useEffect(()=>{setFrameError(false);if(ready||loading||!draft||frameMessage)return;const timer=window.setTimeout(()=>setFrameError(true),20000);return()=>window.clearTimeout(timer);},[ready,loading,page,reloadToken,!!draft,frameMessage]);
 useEffect(()=>{setFrameMessage('');},[page,reloadToken]);
 useEffect(()=>{if(!dirty)return;const guard=(event:BeforeUnloadEvent)=>{event.preventDefault();event.returnValue='';};window.addEventListener('beforeunload',guard);return()=>window.removeEventListener('beforeunload',guard);},[dirty]);

 const change=useCallback((update:(previous:Draft)=>Draft,groupKey='')=>{
  const now=Date.now(),grouped=!!groupKey&&lastEdit.current.key===groupKey&&now-lastEdit.current.at<750;
  lastEdit.current={key:groupKey,at:now};setNotice('');
  setHistory(previous=>{if(!previous)return previous;const next=update(previous.present);if(same(previous.present,next))return previous;return {past:grouped?previous.past:[...previous.past.slice(-49),clone(previous.present)],present:next,future:[]};});
 },[]);
 const changeText=useCallback((key:string,value:string)=>{if(!fieldMap.has(key)||value.length>4000)return;change(previous=>({...previous,content:{...previous.content,[key]:value}}),'text:'+key);},[change]);
 const changeBlock=useCallback((id:string,update:(previous:Block)=>Block,groupKey='')=>change(previous=>({...previous,layout:{...previous.layout,blocks:previous.layout.blocks.map(item=>item.id===id?update(item):item)}}),groupKey),[change]);
 const send=useCallback((message:Record<string,unknown>)=>{if(channel&&frame.current?.contentWindow)frame.current.contentWindow.postMessage({...message,channel},window.location.origin);},[channel]);
 const focusTarget=useCallback((key?:string,blockId?:string)=>{pendingFocus.current={key,blockId};if(ready)requestAnimationFrame(()=>{send({type:'kelo-editor:focus',key,blockId});pendingFocus.current=null;});},[send,ready]);
 useEffect(()=>{if(!ready||!draft)return;send({type:'kelo-editor:state',content:draft.content,layout:draft.layout,mode,selectedKey,selectedBlock});if(pendingFocus.current){const target=pendingFocus.current;pendingFocus.current=null;requestAnimationFrame(()=>send({type:'kelo-editor:focus',...target}));}},[ready,draft,mode,selectedKey,selectedBlock,send]);
 useEffect(()=>{
  const receive=(event:MessageEvent)=>{
   if(event.origin!==window.location.origin||event.source!==frame.current?.contentWindow)return;
   const data=event.data;if(!data||typeof data!=='object'||data.channel!==channel)return;
   if(data.type==='kelo-editor:ready'){setFrameMessage('');setFrameError(false);setReady(true);return;}
   if(data.type==='kelo-editor:error'){setFrameMessage(typeof data.message==='string'?data.message.slice(0,300):'Не удалось подключить редактор страницы.');setReady(false);return;}
   if(data.type==='kelo-editor:navigate'&&typeof data.path==='string'&&PAGES.some(([path])=>path===data.path)){if(!latest.current.busy&&!latest.current.uploading&&data.path!==latest.current.page){pendingFocus.current=null;setReady(false);setSelectedKey(undefined);setSelectedBlock(undefined);setPage(data.path);}return;}
   if(latest.current.busy||latest.current.uploading||latest.current.mode!=='edit')return;
   if(data.type==='kelo-editor:select'&&typeof data.key==='string'&&fieldMap.has(data.key)){setSelectedKey(data.key);setPanel('texts');if(typeof data.blockId==='string')setSelectedBlock(data.blockId);}
   if(data.type==='kelo-editor:block'&&typeof data.blockId==='string'){setSelectedBlock(data.blockId);setSelectedKey(undefined);setPanel('blocks');}
   if(data.type==='kelo-editor:change'&&typeof data.key==='string'&&typeof data.value==='string')changeText(data.key,data.value);
   if(data.type==='kelo-editor:custom-change'&&typeof data.blockId==='string'&&(data.field==='title'||data.field==='text')&&typeof data.value==='string'&&data.value.length<=(data.field==='title'?160:4000)){changeBlock(data.blockId,item=>item.type==='builtin'?item:{...item,[data.field]:data.value},'custom:'+data.blockId+data.field);}
  };
  window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);
 },[channel,changeText,changeBlock]);
 const undo=()=>{lastEdit.current={key:'',at:0};setHistory(previous=>!previous?.past.length?previous:{past:previous.past.slice(0,-1),present:previous.past[previous.past.length-1],future:[clone(previous.present),...previous.future]});setNotice('');};
 const redo=()=>{lastEdit.current={key:'',at:0};setHistory(previous=>!previous?.future.length?previous:{past:[...previous.past,clone(previous.present)],present:previous.future[0],future:previous.future.slice(1)});setNotice('');};
 const close=()=>{if(locked)return;if(dirty&&!window.confirm('Есть несохранённые изменения. Закрыть редактор и отменить их?'))return;onClose();};
 const reload=()=>{if(dirty&&!window.confirm('Загрузить опубликованную версию? Все несохранённые изменения будут отменены.'))return;void load();};
 async function save(){
  if(!draft||locked||validation||!dirty)return;setBusy(true);setError('');setNotice('');
  try{const response=await fetch('/api/admin/site-editor',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedRevision:revision,...draft})});const data=await response.json() as SiteEditorSnapshot&{error?:string};if(response.status===409){setConflict(true);throw new Error('Сайт уже изменён в другом окне. Ваш черновик сохранён в редакторе. Загрузите актуальную версию перед повторным сохранением.');}if(!response.ok)throw new Error(response.status===401?'Сессия закончилась. Черновик остаётся в редакторе; войдите в админку в другой вкладке и повторите сохранение.':data.error||'Не удалось сохранить изменения.');const next=draftOf(data);setSaved(clone(next));setHistory(previous=>({past:previous?.past||[],present:next,future:[]}));setRevision(data.revision);setConflict(false);setNotice('Сохранено. Изменения уже видны на сайте.');window.dispatchEvent(new Event('kelo-content-updated'));}
  catch(cause){setError(cause instanceof Error?cause.message:'Изменения не сохранены.');}finally{setBusy(false);}
 }
 function move(id:string,delta:number){change(previous=>{const blocks=[...previous.layout.blocks],index=blocks.findIndex(item=>item.id===id),next=index+delta;if(index<0||next<0||next>=blocks.length)return previous;[blocks[index],blocks[next]]=[blocks[next],blocks[index]];return {...previous,layout:{...previous.layout,blocks}};});}
 function add(type:'text'|'image'){
  const id='custom-'+crypto.randomUUID(),next:CustomBlock={id,type,hidden:false,title:type==='image'?'История в деталях':'Новая история Кело',text:'Нажмите на этот текст и расскажите свою историю.',image:type==='image'?'/images/gallery/home-shelf.webp':'',alt:type==='image'?'Пример полки Кело — замените своей фотографией':'',theme:'dark',align:'left'};
  change(previous=>({...previous,layout:{...previous.layout,blocks:[...previous.layout.blocks,next]}}));setSelectedKey(undefined);setSelectedBlock(id);if(page!=='/'){pendingFocus.current={blockId:id};setReady(false);setPage('/');}else focusTarget(undefined,id);setPanel('blocks');setMode('edit');if(type==='image')setNotice('Добавлен блок с примером фото. Замените его своей фотографией.');
 }
 async function upload(file:File,id:string){
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){setError('Выберите JPG, PNG или WebP размером до 5 МБ.');return;}
  setUploading(true);setError('');try{const body=new FormData();body.set('file',file);const response=await fetch('/api/upload',{method:'POST',body});const data=await response.json() as {image?:string;error?:string};if(!response.ok||!data.image)throw new Error(data.error||'Не удалось загрузить фото.');changeBlock(id,item=>item.type==='builtin'?item:{...item,image:data.image!});setNotice('Фото загружено в черновик. Сохраните изменения.');}catch(cause){setError(cause instanceof Error?cause.message:'Не удалось загрузить фото.');}finally{setUploading(false);}
 }
 useEffect(()=>{const target=canvas.current;if(!target)return;const measure=()=>setPhoneScale(Math.min(1,Math.max(.4,(target.clientWidth-32)/375)));measure();const observer=new ResizeObserver(measure);observer.observe(target);return()=>observer.disconnect();},[loading,!!draft,viewport]);
 useEffect(()=>{if(custom)requestAnimationFrame(()=>document.getElementById('ve-block-heading')?.scrollIntoView({block:'nearest'}));},[custom?.id]);
 const filteredFields=SITE_CONTENT_FIELDS.filter(field=>(field.label+' '+(draft?.content[field.key]||field.defaultValue)).toLocaleLowerCase('ru-RU').includes(search.trim().toLocaleLowerCase('ru-RU')));
 return <dialog ref={editorDialog} className="visual-editor" aria-label="Визуальный редактор сайта" onCancel={event=>{event.preventDefault();close();}}>
  <header className="ve-toolbar">
   <div className="ve-title"><span className="ve-mark">K</span><div><strong>Редактор сайта</strong><span>{dirty?'Есть изменения':'KELO WOOD MARKET'}</span></div></div>
   <label className="ve-page"><span>Страница</span><select value={page} disabled={locked} onChange={event=>{setPage(event.target.value);setReady(false);setSelectedKey(undefined);setSelectedBlock(undefined);}}>{PAGES.map(([path,label])=><option value={path} key={path}>{label}</option>)}</select></label>
   <div className="ve-viewport" role="group" aria-label="Размер предпросмотра"><button type="button" className={viewport==='desktop'?'is-active':''} aria-pressed={viewport==='desktop'} aria-label="Десктоп" onClick={()=>setViewport('desktop')}><Monitor size={18}/></button><button type="button" className={viewport==='mobile'?'is-active':''} aria-pressed={viewport==='mobile'} aria-label="Телефон, ширина 375 пикселей" onClick={()=>setViewport('mobile')}><Smartphone size={18}/></button></div>
   <div className="ve-history" role="group" aria-label="История изменений"><button type="button" aria-label="Отменить изменение" disabled={locked||!history?.past.length} onClick={undo}><Undo2 size={18}/></button><button type="button" aria-label="Повторить изменение" disabled={locked||!history?.future.length} onClick={redo}><Redo2 size={18}/></button></div>
   <button type="button" className={'ve-mode '+(mode==='preview'?'is-active':'')} disabled={locked} onClick={()=>setMode(value=>value==='edit'?'preview':'edit')}>{mode==='edit'?<Eye size={17}/>:<MousePointer2 size={17}/>}<span>{mode==='edit'?'Просмотр':'Редактировать'}</span></button>
   <button type="button" className="ve-save" onClick={()=>void save()} disabled={loading||locked||!dirty||!!validation}>{busy?<Loader2 size={17} className="spin"/>:<Save size={17}/>}<span>{busy?'Сохраняем…':'Сохранить'}</span></button>
   <button type="button" className="ve-close" aria-label="Закрыть редактор" disabled={locked} onClick={close}><X size={20}/></button>
  </header>
  <div className="ve-feedback" aria-live="polite">{error?<p className="ve-error" role="alert">{error}{conflict&&<button type="button" onClick={reload}>Загрузить актуальную версию</button>}</p>:notice?<p className="ve-success"><Check size={16}/>{notice}</p>:<p>{mode==='edit'?'Нажмите на текст на странице и пишите прямо в блоке. Сохранение — по кнопке справа.':'Так выглядит ваш черновик. Вернитесь в редактирование, чтобы изменить текст.'}</p>}</div>
  {loading?<div className="ve-full-state" role="status"><Loader2 className="spin" size={28}/><h2>Открываем ваш сайт</h2><p>Загружаем блоки и сохранённые тексты.</p></div>:!draft?<div className="ve-full-state"><FileText size={30}/><h2>Редактор пока не открылся</h2><p>Проверьте подключение и повторите загрузку.</p><button type="button" onClick={()=>void load()}><RotateCcw size={17}/>Повторить</button></div>:<div className="ve-workspace">
   <aside className="ve-sidebar" aria-label="Блоки и свойства">
    <div className="ve-panel-tabs"><button type="button" className={panel==='blocks'?'is-active':''} onClick={()=>setPanel('blocks')}><Layers size={16}/>Блоки</button><button type="button" className={panel==='texts'?'is-active':''} onClick={()=>setPanel('texts')}><FileText size={16}/>Тексты</button></div>
    <div className="ve-panel-scroll">
     {panel==='blocks'?<>
      <div className="ve-panel-heading"><h2>Блоки главной</h2><p>Меняйте порядок, скрывайте блоки или добавляйте свои.</p></div>
      {page!=='/'&&<button className="ve-home-link" type="button" disabled={locked} onClick={()=>{setPage('/');setReady(false);}}>Открыть главную для работы с блоками</button>}
      <ol className="ve-block-list">{draft.layout.blocks.map((item,index)=><li className={(selectedBlock===item.id?'is-selected ':'')+(item.hidden?'is-hidden':'')} key={item.id}><button type="button" className="ve-block-select" disabled={locked} onClick={()=>{setSelectedBlock(item.id);setSelectedKey(undefined);if(page!=='/'){pendingFocus.current={blockId:item.id};setReady(false);setPage('/');}else focusTarget(undefined,item.id);setPanel('blocks');}}><span className="ve-block-number">{String(index+1).padStart(2,'0')}</span><span>{blockLabel(item)}{item.hidden&&<small>Скрыт на сайте</small>}</span></button><div className="ve-block-actions"><button type="button" aria-label={'Поднять блок «'+blockLabel(item)+'»'} disabled={locked||index===0} onClick={()=>move(item.id,-1)}><ArrowUp size={15}/></button><button type="button" aria-label={'Опустить блок «'+blockLabel(item)+'»'} disabled={locked||index===draft.layout.blocks.length-1} onClick={()=>move(item.id,1)}><ArrowDown size={15}/></button><button type="button" aria-label={(item.hidden?'Показать':'Скрыть')+' блок «'+blockLabel(item)+'»'} aria-pressed={item.hidden} disabled={locked} onClick={()=>changeBlock(item.id,previous=>({...previous,hidden:!previous.hidden}))}>{item.hidden?<EyeOff size={15}/>:<Eye size={15}/>}</button></div></li>)}</ol>
      <div className="ve-add-actions"><button type="button" disabled={locked||draft.layout.blocks.length>=HOME_BLOCKS.length+MAX_CUSTOM_BLOCKS} onClick={()=>add('text')}><Plus size={17}/>Текстовый блок</button><button type="button" disabled={locked||draft.layout.blocks.length>=HOME_BLOCKS.length+MAX_CUSTOM_BLOCKS} onClick={()=>add('image')}><ImageIcon size={17}/>Блок с фотографией</button></div>
     </>:<>
      <div className="ve-panel-heading"><h2>Текст на странице</h2><p>Нажмите на надпись в макете или найдите её в списке.</p></div>
      <label className="ve-search">Найти текст<input type="search" placeholder="Например: доставка" value={search} onChange={event=>setSearch(event.target.value)}/></label>
      <div className="ve-text-list">{filteredFields.map(field=><button type="button" className={selectedKey===field.key?'is-selected':''} disabled={locked} key={field.key} onClick={()=>{setSelectedKey(field.key);focusTarget(field.key);}}><span>{field.label.split(' · ')[0]}</span><strong>{draft.content[field.key]??field.defaultValue}</strong></button>)}</div>
     </>}
     {selectedField&&<section className="ve-properties" aria-labelledby="ve-text-heading"><span className="ve-property-eyebrow">ВЫБРАННЫЙ ТЕКСТ</span><h2 id="ve-text-heading">{selectedField.label}</h2><label>Текст<textarea rows={6} value={draft.content[selectedField.key]??selectedField.defaultValue} disabled={locked} maxLength={4000} aria-invalid={!draft.content[selectedField.key]?.trim()} aria-describedby="ve-text-help" onChange={event=>changeText(selectedField.key,event.target.value)}/></label><p id="ve-text-help" className={!draft.content[selectedField.key]?.trim()?'ve-inline-error':'ve-help'}>{!draft.content[selectedField.key]?.trim()?'Введите текст перед сохранением.':'Одинаковые надписи обновятся во всех местах сайта.'}</p><button className="ve-reset" type="button" disabled={locked} onClick={()=>changeText(selectedField.key,selectedField.defaultValue)}><RotateCcw size={15}/>Вернуть исходный текст</button></section>}
     {custom&&<section className="ve-properties" aria-labelledby="ve-block-heading"><span className="ve-property-eyebrow">СВОЙ БЛОК</span><h2 id="ve-block-heading">{custom.type==='image'?'Текст и фотография':'Текстовый блок'}</h2><label>Заголовок<input value={custom.title} maxLength={160} disabled={locked} required onChange={event=>changeBlock(custom.id,item=>item.type==='builtin'?item:{...item,title:event.target.value},'title:'+custom.id)}/></label><label>Текст<textarea rows={5} value={custom.text} maxLength={4000} disabled={locked} required onChange={event=>changeBlock(custom.id,item=>item.type==='builtin'?item:{...item,text:event.target.value},'body:'+custom.id)}/></label>
      {custom.type==='image'&&<><div className="ve-image-preview">{custom.image?<img src={custom.image} alt={custom.alt||'Фотография блока'}/>:<span><ImageIcon size={28}/>Добавьте фотографию</span>}</div><label className={'ve-upload '+(locked?'is-disabled':'')}><Upload size={16}/>{uploading?'Загружаем…':'Загрузить фото'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={locked} onChange={event=>{const file=event.target.files?.[0];event.currentTarget.value='';if(file)void upload(file,custom.id);}}/></label><p className="ve-help">JPG, PNG или WebP, до 5 МБ.</p><label>Описание фотографии<input value={custom.alt} maxLength={240} disabled={locked} required onChange={event=>changeBlock(custom.id,item=>item.type==='builtin'?item:{...item,alt:event.target.value},'alt:'+custom.id)}/></label></>}
      <label>Фон<select value={custom.theme} disabled={locked} onChange={event=>changeBlock(custom.id,item=>item.type==='builtin'?item:{...item,theme:event.target.value as 'dark'|'wood'})}><option value="dark">Тёмный</option><option value="wood">Светлый древесный</option></select></label><label>Выравнивание<select value={custom.align} disabled={locked} onChange={event=>changeBlock(custom.id,item=>item.type==='builtin'?item:{...item,align:event.target.value as 'left'|'center'})}><option value="left">По левому краю</option><option value="center">По центру</option></select></label>
      {(!custom.title.trim()||!custom.text.trim()||(custom.type==='image'&&(!custom.image||!custom.alt.trim())))&&<p className="ve-inline-error">Заполните заголовок и текст{custom.type==='image'?', добавьте фото и его описание':''}.</p>}
      <button className="ve-delete" type="button" disabled={locked} onClick={()=>{if(!window.confirm('Удалить этот блок? Действие можно отменить до закрытия редактора.'))return;change(previous=>({...previous,layout:{...previous.layout,blocks:previous.layout.blocks.filter(item=>item.id!==custom.id)}}));setSelectedBlock(undefined);}}><Trash2 size={16}/>Удалить блок</button>
     </section>}
     {validation&&<p className="ve-inline-error ve-validation" role="status">{validation}</p>}
     <div className="ve-sidebar-footer"><button type="button" disabled={locked} onClick={reload}><RotateCcw size={15}/>Отменить черновик</button><span>Версия {revision}</span></div>
    </div>
   </aside>
   <div ref={canvas} className={'ve-canvas '+(viewport==='mobile'?'is-mobile':'')+(locked?' is-busy':'')}>
    <div className="ve-canvas-caption"><span><i/>{mode==='edit'?'РЕДАКТИРОВАНИЕ':'ПРЕДПРОСМОТР'}</span><span>{viewport==='mobile'?'375 px':'Десктоп'} · {PAGES.find(([path])=>path===page)?.[1]}</span></div>
    <div className="ve-frame-shell">{channel&&<iframe key={page+'-'+reloadToken} ref={frame} title={'Редактируемая страница: '+(PAGES.find(([path])=>path===page)?.[1]||'сайт')} src={page+'?kelo-editor=1&channel='+encodeURIComponent(channel)} style={viewport==='mobile'?{width:375,height:String(100/phoneScale)+'%',transform:'scale('+phoneScale+')'}:undefined} onLoad={()=>{const current=latest.current;if(current.history)send({type:'kelo-editor:state',...current.history.present,mode:current.mode,selectedKey:current.selectedKey,selectedBlock:current.selectedBlock});}}/>}{!ready&&<div className="ve-frame-loading" role="status">{!frameError&&!frameMessage&&<Loader2 size={22} className="spin"/>}<span>{frameMessage||(frameError?'Не удалось подключить редактор страницы. Проверьте вход в админку и повторите загрузку.':'Подключаем страницу…')}</span><button type="button" onClick={()=>{setReady(false);setReloadToken(value=>value+1);}}>Перезагрузить страницу</button></div>}</div>
   </div>
  </div>}
 </dialog>;
}
