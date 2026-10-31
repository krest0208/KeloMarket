export function createLengthDetent(initial:number,min:number,max:number,pauseMs=120){
 const clamp=(value:number)=>Math.max(min,Math.min(max,Math.round(value)));
 let previous=clamp(initial),pending=previous,held:number|null=null,until=0;
 return {
  input(value:number,now:number){
   pending=clamp(value);
   if(held!==null&&now<until){previous=pending;return {value:held,holdFor:until-now};}
   if(held!==null){held=null;previous=pending;return {value:pending,holdFor:0};}
   const direction=Math.sign(pending-previous);
   const tick=direction>0?Math.floor(pending/10)*10:Math.ceil(pending/10)*10;
   const crossed=direction>0?previous<tick:direction<0&&previous>tick;
   previous=pending;
   if(crossed&&tick>=min&&tick<=max){held=tick;until=now+pauseMs;return {value:tick,holdFor:pauseMs};}
   return {value:pending,holdFor:0};
  },
  finish(){held=null;previous=pending;return pending;}
 };
}
