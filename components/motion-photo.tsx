'use client';
import {useEffect,useRef} from 'react';
import {AnimatePresence,motion,useInView,useReducedMotion} from 'motion/react';
import {createPhotoWheel,swipeStep} from '@/lib/gallery-gestures';
import type {GalleryPhoto} from '@/lib/gallery-photos';

export function MotionPhoto({photos,index,direction,onStep,label,href,onOpen,large=false,verticalWheel=false}:{photos:GalleryPhoto[];index:number;direction:number;onStep:(step:number)=>void;label:string;href?:string;onOpen?:()=>void;large?:boolean;verticalWheel?:boolean}){
 const root=useRef<HTMLDivElement>(null),dragged=useRef(false),latest=useRef({index,onStep});
 latest.current={index,onStep};
 const reduced=useReducedMotion(),near=useInView(root,{once:true,margin:'160px'}),photo=photos[index];
 useEffect(()=>{
  const element=root.current;if(!element)return;
  const consume=createPhotoWheel();
  const wheel=(e:WheelEvent)=>{
   if(e.ctrlKey||e.metaKey)return;
   const horizontal=Math.abs(e.deltaX)>Math.abs(e.deltaY);
   if(!horizontal&&!verticalWheel)return;
   const delta=(horizontal?e.deltaX:e.deltaY)*(e.deltaMode===1?16:e.deltaMode===2?element.clientWidth:1);
   const result=consume(delta,performance.now(),latest.current.index,photos.length);
   if(result.prevent)e.preventDefault();
   if(result.step)latest.current.onStep(result.step);
  };
  element.addEventListener('wheel',wheel,{passive:false});
  return()=>element.removeEventListener('wheel',wheel);
 },[photos.length,verticalWheel]);
 useEffect(()=>{
  if(!near||photos.length<2)return;
  for(const step of [-1,1]){const next=photos[index+step];if(next){const image=new Image();image.src=next.src;}}
 },[near,index,photos]);
 if(!photo)return null;
 const image=<AnimatePresence initial={false} custom={direction}><motion.img key={photo.src} className={large?'photo-lightbox-image':'photo-gallery-image'} src={photo.src} alt={photo.alt} width="1536" height="1024" loading="lazy" decoding="async" draggable={false} custom={direction} variants={{enter:(d:number)=>({x:reduced?0:`${d*100}%`,opacity:reduced?0:1}),center:{x:0,opacity:1},leave:(d:number)=>({x:reduced?0:`${d*-100}%`,opacity:reduced?0:1})}} initial="enter" animate="center" exit="leave" transition={reduced?{duration:.12}:{type:'spring',stiffness:330,damping:36,mass:.8}}/></AnimatePresence>;
 return <div ref={root} className={'motion-photo-stage '+(large?'motion-photo-large':'')} onPointerDownCapture={()=>{dragged.current=false;}} onClickCapture={e=>{if(dragged.current){e.preventDefault();e.stopPropagation();dragged.current=false;}}} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();onStep(e.key==='ArrowRight'?1:-1);}}}>
  <motion.div className="motion-photo-drag" drag={photos.length>1?'x':false} dragConstraints={{left:0,right:0}} dragElastic={.16} dragMomentum={false} dragSnapToOrigin onDragStart={()=>{dragged.current=true;}} onDragEnd={(_,info)=>{const step=swipeStep(info.offset.x,info.velocity.x,root.current?.clientWidth||400);if(step)onStep(step);}} transition={{type:'spring',stiffness:380,damping:35}}>
   {large?<div className="photo-main-link">{image}</div>:href?<a className="photo-main-link" href={href} aria-label={'Открыть '+label} draggable={false}>{image}</a>:<button className="photo-open" type="button" onClick={onOpen} aria-label={'Увеличить фото: '+label}>{image}<span className="photo-open-label">Рассмотреть</span></button>}
  </motion.div>
 </div>;
}
