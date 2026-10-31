'use client';
import {useEffect,useRef} from 'react';
import {useReducedMotion} from 'motion/react';
import {createLengthDetent} from '@/lib/length-detents';

export function DetentRange({id,min,max,value,onChange}:{id:string;min:number;max:number;value:number;onChange:(value:number)=>void}){
 const controller=useRef(createLengthDetent(value,min,max)),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const pointer=useRef({active:false,moved:false,startX:0}),emit=useRef(onChange),reduced=useReducedMotion();emit.current=onChange;
 const clearTimer=()=>{if(timer.current!==null){clearTimeout(timer.current);timer.current=null;}};
 const finish=()=>{if(!pointer.current.active)return;pointer.current.active=false;clearTimer();emit.current(controller.current.finish());};
 const finishRef=useRef(finish);finishRef.current=finish;
 useEffect(()=>{
  const release=()=>finishRef.current();
  window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
  return()=>{window.removeEventListener('pointerup',release);window.removeEventListener('pointercancel',release);clearTimer();};
 },[]);
 useEffect(()=>{pointer.current.active=false;clearTimer();controller.current=createLengthDetent(value,min,max);},[min,max,reduced]);
 return <input id={id} className="range" aria-label="Длина доски в сантиметрах" aria-valuetext={`${value} см`} type="range" min={min} max={max} step={1} value={value}
  onPointerDown={e=>{clearTimer();pointer.current={active:true,moved:false,startX:e.clientX};controller.current=createLengthDetent(value,min,max);}}
  onPointerMove={e=>{if(pointer.current.active&&Math.abs(e.clientX-pointer.current.startX)>3)pointer.current.moved=true;}}
  onPointerUp={finish} onPointerCancel={finish} onBlur={finish} onKeyDown={finish}
  onChange={e=>{
   const raw=Number(e.target.value);
   if(!pointer.current.active||!pointer.current.moved||reduced){clearTimer();controller.current=createLengthDetent(raw,min,max);emit.current(raw);return;}
   const next=controller.current.input(raw,performance.now());emit.current(next.value);
   if(next.holdFor>0&&timer.current===null)timer.current=setTimeout(()=>{timer.current=null;if(pointer.current.active)emit.current(controller.current.finish());},next.holdFor);
  }}/>;
}
