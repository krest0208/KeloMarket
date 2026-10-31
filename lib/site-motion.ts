import { animate, hover, inView, press, scroll } from 'motion';

export function setupSiteMotion(root:HTMLElement){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return()=>{};
 const revealTargets='.section-title,.gallery-section-heading,.gallery-hero-copy,.gallery-material-heading,.gallery-karelia>div,.gallery-karelia>img,.gallery-comparison-card,.gallery-material-grid>article,.project-example,.steps-grid>.step,.delivery-grid>div,.closing-section,.page-title,.catalog-banner,.constructor-help,.product-care,.product-detail-grid>div,.product-card,.mobile-nav';
 const actionTargets='button:not(:disabled):not(.photo-open),a.btn,a.kmw-action,a.product-go,a.cart-link,.desktop-nav a,.product-nav-links a,.gallery-comparison-link,.project-example-link';
 const revealed=new WeakSet<Element>(),gestures=new Map<HTMLElement,()=>void>(),entrances=new Map<HTMLElement,()=>void>(),scrollScenes=new Map<HTMLElement,()=>void>(),spinners=new Map<HTMLElement,()=>void>();
 const running=new Map<HTMLElement,ReturnType<typeof animate>>(),touched=new Set<HTMLElement>(),feedbackText=new WeakMap<HTMLElement,string>();
 let disposed=false,pendingFrame=0,anchorAnimation:ReturnType<typeof animate>|undefined;
 const spring={type:'spring' as const,stiffness:440,damping:34,mass:.75};
 const ease=[.16,1,.3,1] as [number,number,number,number];
 function play(element:HTMLElement,frames:Parameters<typeof animate>[1],options:Parameters<typeof animate>[2]){
  if(disposed||!root.contains(element))return;
  running.get(element)?.stop();running.set(element,animate(element,frames,options));touched.add(element);
 }
 function register(){
  if(disposed)return;
  for(const map of [gestures,entrances,scrollScenes,spinners])for(const [element,cancel]of map)if(!root.contains(element)){cancel();map.delete(element);}
  for(const [element,animation]of running)if(!root.contains(element)){animation.cancel();running.delete(element);touched.delete(element);}
  if(window.matchMedia('(min-width: 801px)').matches){
   for(const element of root.querySelectorAll<HTMLElement>('.gallery-hero-image,.gallery-karelia>img')){
    if(scrollScenes.has(element))continue;
    const target=element.closest<HTMLElement>('.gallery-hero,.gallery-karelia');if(!target)continue;
    const hero=element.matches('.gallery-hero-image');
    const animation=animate(element,{y:hero?[0,-30]:[12,-12],scale:hero?[1,1.045]:[1.08,1.08]},{ease:'linear'});
    const cancel=scroll(animation,{target,offset:hero?['start start','end start']:['start end','end start']});
    scrollScenes.set(element,()=>{cancel();animation.cancel();element.style.removeProperty('transform');});
   }
  }
  for(const element of root.querySelectorAll<HTMLElement>(revealTargets)){
   if(revealed.has(element))continue;revealed.add(element);
   if(element.parentElement?.closest(revealTargets))continue;
   const parent=element.parentElement;
   const staggered=parent?.matches('.gallery-comparison-grid,.gallery-material-grid,.project-examples-grid,.steps-grid,.product-grid');
   const order=staggered?Array.prototype.indexOf.call(parent!.children,element):0;
   const cancel=inView(element,()=>{play(element,{opacity:[0,1],y:[staggered?42:28,0]},{duration:.5,delay:Math.min(order*.065,.195),ease});},{amount:.1,margin:'0px 0px -12px 0px'});
   entrances.set(element,cancel);
  }
  for(const element of root.querySelectorAll<HTMLElement>(actionTargets)){
   if(gestures.has(element))continue;
   const unpress=press(element,()=>{
    if(element.matches(':disabled')||element.getAttribute('aria-disabled')==='true')return;
    play(element,{scale:.965},{duration:.1});return()=>play(element,{scale:1},spring);
   });
   const unhover=hover(element,()=>{
    if(element.matches('.photo-thumbnails button'))return;
    play(element,{y:-1},{duration:.18,ease});return()=>play(element,{y:0,scale:1},spring);
   });
   gestures.set(element,()=>{unpress();unhover();});
  }
  for(const element of root.querySelectorAll<HTMLElement>('.config-total strong,.cart-count')){
   const value=element.textContent||'',previous=feedbackText.get(element);
   if((previous!==undefined&&previous!==value)||(previous===undefined&&element.matches('.cart-count'))){
    const editing=document.activeElement?.matches('input[type=range],input[type=number]');
    if(!editing||!element.matches('.config-total strong'))play(element,element.matches('.cart-count')?{scale:[.85,1.16,1]}:{opacity:[.55,1],y:[3,0]},{duration:.25,ease});
   }
   feedbackText.set(element,value);
  }
  for(const element of root.querySelectorAll<HTMLElement>('.faq-list details')){
   const state=String(element.hasAttribute('open'));
   if(feedbackText.get(element)===state)continue;
   const icon=element.querySelector<HTMLElement>('summary svg'),body=element.querySelector<HTMLElement>('p');
   if(icon)play(icon,{rotate:element.hasAttribute('open')?45:0},spring);
   if(body&&element.hasAttribute('open'))play(body,{opacity:[0,1],y:[-5,0]},{duration:.22,ease});
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
  const top=Math.max(0,Math.min(document.documentElement.scrollHeight-window.innerHeight,target.getBoundingClientRect().top+window.scrollY-120));
  anchorAnimation=animate(window.scrollY,top,{duration:.65,ease,onUpdate:value=>window.scrollTo(0,value)});
  window.history.pushState(null,'',url.hash);
 };
 const cancelAnchor=()=>anchorAnimation?.stop();
 root.addEventListener('click',anchorClick);window.addEventListener('wheel',cancelAnchor,{passive:true});window.addEventListener('touchstart',cancelAnchor,{passive:true});
 register();observer.observe(root,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['disabled','open']});
 return()=>{
  disposed=true;observer.disconnect();cancelAnimationFrame(pendingFrame);anchorAnimation?.stop();
  root.removeEventListener('click',anchorClick);window.removeEventListener('wheel',cancelAnchor);window.removeEventListener('touchstart',cancelAnchor);
  for(const map of [gestures,entrances,scrollScenes,spinners]){for(const cancel of map.values())cancel();map.clear();}
  for(const animation of running.values())animation.cancel();
  for(const element of touched){element.style.removeProperty('transform');element.style.removeProperty('opacity');}
  running.clear();touched.clear();
 };
}
