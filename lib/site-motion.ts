import { animate, press } from 'motion';

export function setupSiteMotion(root:HTMLElement){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return()=>{};
 const buyerPages='main.gallery-home,main.board-page,main.products-page,main.constructor-page,main.product-page,main.cart-page,main.checkout-page,main.checkout-success';
 const actionTargets='button:not(:disabled):not(.photo-open),a.btn,a.product-go,.project-example-link';
 const entered=new WeakSet<Element>(),gestures=new Map<HTMLElement,()=>void>(),spinners=new Map<HTMLElement,()=>void>();
 const running=new Map<HTMLElement,ReturnType<typeof animate>>(),touched=new Set<HTMLElement>(),feedbackText=new WeakMap<HTMLElement,string>();
 let disposed=false,pendingFrame=0,anchorAnimation:ReturnType<typeof animate>|undefined;
 const ease=[.22,1,.36,1] as [number,number,number,number];
 function play(element:HTMLElement,frames:Parameters<typeof animate>[1],options:Parameters<typeof animate>[2]){
  if(disposed||!root.contains(element))return;
  running.get(element)?.stop();running.set(element,animate(element,frames,options));touched.add(element);
 }
 function register(){
  if(disposed)return;
  for(const map of [gestures,spinners])for(const [element,cancel]of map)if(!root.contains(element)){cancel();map.delete(element);}
  for(const [element,animation]of running)if(!root.contains(element)){animation.cancel();running.delete(element);touched.delete(element);}
  if(document.documentElement.classList.contains('kelo-edit-frame')){
   for(const cancel of gestures.values())cancel();gestures.clear();return;
  }
  const page=root.querySelector<HTMLElement>(buyerPages);
  const title=page?.querySelector<HTMLElement>('.gallery-hero-copy,.page-title');
  if(title&&!entered.has(title)){entered.add(title);play(title,{opacity:[0,1],y:[8,0]},{duration:.32,ease});}
  for(const element of page?.querySelectorAll<HTMLElement>(actionTargets)||[]){
   if(gestures.has(element))continue;
   const unpress=press(element,()=>{
    if(element.matches(':disabled')||element.getAttribute('aria-disabled')==='true')return;
    play(element,{scale:.98},{duration:.12,ease});return()=>play(element,{scale:1},{duration:.16,ease});
   });
   gestures.set(element,unpress);
  }
  for(const element of root.querySelectorAll<HTMLElement>('.config-total strong,.cart-count')){
   const value=element.textContent||'',previous=feedbackText.get(element);
   if((previous!==undefined&&previous!==value)||(previous===undefined&&element.matches('.cart-count'))){
    const editing=document.activeElement?.matches('input[type=range],input[type=number]');
    if(!editing||!element.matches('.config-total strong'))play(element,element.matches('.cart-count')?{scale:[.94,1]}:{opacity:[.65,1],y:[2,0]},{duration:.18,ease});
   }
   feedbackText.set(element,value);
  }
  for(const element of root.querySelectorAll<HTMLElement>('.faq-list details')){
   const state=String(element.hasAttribute('open'));
   if(feedbackText.get(element)===state)continue;
   const icon=element.querySelector<HTMLElement>('summary svg'),body=element.querySelector<HTMLElement>('p');
   if(icon)play(icon,{rotate:element.hasAttribute('open')?45:0},{duration:.18,ease});
   if(body&&element.hasAttribute('open'))play(body,{opacity:[0,1],y:[-4,0]},{duration:.2,ease});
   feedbackText.set(element,state);
  }
  for(const element of root.querySelectorAll<HTMLElement>('.spin'))if(!spinners.has(element)){
   const animation=animate(element,{rotate:[0,360]},{duration:1,ease:'linear',repeat:Infinity});spinners.set(element,()=>animation.cancel());
  }
 }
 const observer=new MutationObserver(records=>{
  if(records.some(record=>record.type==='childList'&&record.target instanceof HTMLElement&&record.target.matches('.product-grid'))){const grid=root.querySelector<HTMLElement>('.catalog-products');if(grid)play(grid,{opacity:[.65,1],y:[8,0]},{duration:.25,ease});}
  if(pendingFrame)return;pendingFrame=requestAnimationFrame(()=>{pendingFrame=0;register();});
 });
 const anchorClick=(event:MouseEvent)=>{
  if(event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(!link)return;
  const url=new URL(link.href,window.location.href);
  if(url.origin!==window.location.origin||url.pathname!==window.location.pathname||url.search!==window.location.search||!url.hash)return;
  let id;try{id=decodeURIComponent(url.hash.slice(1));}catch{return;}
  const target=document.getElementById(id);if(!target)return;
  event.preventDefault();anchorAnimation?.stop();
  const headerHeight=root.querySelector<HTMLElement>('.header')?.getBoundingClientRect().height||0;
  const top=Math.max(0,Math.min(document.documentElement.scrollHeight-window.innerHeight,target.getBoundingClientRect().top+window.scrollY-headerHeight-16));
  anchorAnimation=animate(window.scrollY,top,{duration:.4,ease,onUpdate:value=>window.scrollTo(0,value)});
  window.history.pushState(null,'',url.hash);
 };
 const cancelAnchor=()=>anchorAnimation?.stop();
 root.addEventListener('click',anchorClick);window.addEventListener('wheel',cancelAnchor,{passive:true});window.addEventListener('touchstart',cancelAnchor,{passive:true});
 register();observer.observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['disabled','open']});
 return()=>{
  disposed=true;observer.disconnect();cancelAnimationFrame(pendingFrame);anchorAnimation?.stop();
  root.removeEventListener('click',anchorClick);window.removeEventListener('wheel',cancelAnchor);window.removeEventListener('touchstart',cancelAnchor);
  for(const map of [gestures,spinners]){for(const cancel of map.values())cancel();map.clear();}
  for(const animation of running.values())animation.cancel();
  for(const element of touched){element.style.removeProperty('transform');element.style.removeProperty('opacity');}
  running.clear();touched.clear();
 };
}
