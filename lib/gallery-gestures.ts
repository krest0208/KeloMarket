export function photoIndex(index:number,step:number,count:number,wrap=false){
 if(count<1)return 0;
 return wrap?((index+step)%count+count)%count:Math.max(0,Math.min(count-1,index+step));
}

export function swipeStep(offset:number,velocity:number,width:number){
 const threshold=Math.max(32,Math.min(80,width*.12));
 if(Math.abs(offset)>=threshold||(Math.abs(offset)>12&&Math.abs(velocity)>500))return offset<0?1:-1;
 return 0;
}

export function createPhotoWheel(){
 let accumulated=0,lastEvent=-Infinity,lockedUntil=-Infinity;
 return (delta:number,now:number,index:number,count:number)=>{
  if(!Number.isFinite(delta)||!delta||count<2)return {step:0,prevent:false};
  if(now<lockedUntil)return {step:0,prevent:true};
  const step=delta>0?1:-1;
  if(photoIndex(index,step,count)===index){accumulated=0;lastEvent=now;return {step:0,prevent:false};}
  if(now-lastEvent>180||Math.sign(accumulated)!==step)accumulated=0;
  accumulated+=delta;lastEvent=now;
  if(Math.abs(accumulated)<36)return {step:0,prevent:true};
  accumulated=0;lockedUntil=now+420;
  return {step,prevent:true};
 };
}
