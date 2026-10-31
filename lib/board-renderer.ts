import type * as ThreeTypes from 'three';
import {createBoardMesh} from './board-model';
import type {Product,Configuration} from './catalog';

export type BoardView='volume'|'top'|'edge';
export interface BoardRenderer {update:(p:Product,c:Configuration)=>void;view:(v:BoardView)=>void;rotate:()=>void;zoom:(factor:number)=>void;dispose:()=>void}
export async function mountBoardRenderer(host:HTMLElement,p:Product,c:Configuration,textureSrc:string,onError:()=>void):Promise<BoardRenderer>{
 const THREE=await import('three');
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 const canvas=renderer.domElement;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Объёмная модель доски Кело. Управление ракурсом и масштабом — кнопками ниже.');canvas.style.touchAction='none';host.appendChild(canvas);
 const scene=new THREE.Scene();scene.background=new THREE.Color('#000000');const camera=new THREE.PerspectiveCamera(32,1,.005,100);const group=new THREE.Group();scene.add(group);
 scene.add(new THREE.HemisphereLight(0xffffff,0x413c35,2.6));const key=new THREE.DirectionalLight(0xfff1db,3.4);key.position.set(1,4,3);scene.add(key);const rim=new THREE.DirectionalLight(0xd8e5ff,2.4);rim.position.set(-2,2,-2);scene.add(rim);const front=new THREE.DirectionalLight(0xffffff,.8);front.position.set(2,.2,4);scene.add(front);
 let disposed=false,visible=true,frame=0,az=.3,elevation=.8,zoom=1,targetAz=az,targetElevation=elevation,targetZoom=zoom,length=1,width=.3,thickness=.04,texture:ThreeTypes.Texture|null=null;
 const meshes:ThreeTypes.Mesh<ThreeTypes.BufferGeometry,ThreeTypes.MeshStandardMaterial>[]=[];const pointers=new Map<number,{x:number;y:number}>();let pinch=0;let last=0;let needsModel:{p:Product;c:Configuration}|null=null;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function fit(){const h=length*Math.abs(Math.cos(az))+width*Math.abs(Math.sin(az));const depth=length*Math.abs(Math.sin(az))+width*Math.abs(Math.cos(az));const v=depth*Math.abs(Math.sin(elevation))+thickness*Math.abs(Math.cos(elevation));const tan=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));return Math.max(h/(2*tan*camera.aspect),v/(2*tan))*1.22+depth*Math.abs(Math.cos(elevation))*.5+.04;}
 function render(time:number){frame=0;if(disposed||!visible||document.hidden)return;
  if(needsModel){const next=needsModel;needsModel=null;build(next.p,next.c);}
  const step=reduced.matches||pointers.size?1:Math.min(1,(time-last||16)/75);last=time;az+=(targetAz-az)*step;elevation+=(targetElevation-elevation)*step;zoom+=(targetZoom-zoom)*step;
  const r=fit()*zoom;camera.position.set(Math.sin(az)*Math.cos(elevation)*r,Math.sin(elevation)*r,Math.cos(az)*Math.cos(elevation)*r);camera.lookAt(0,0,0);renderer.render(scene,camera);
  if(Math.abs(az-targetAz)+Math.abs(elevation-targetElevation)+Math.abs(zoom-targetZoom)>.0005)invalidate();
 }
 function invalidate(){if(!disposed&&visible&&!document.hidden&&!frame)frame=requestAnimationFrame(render);}
 function clear(){for(const mesh of meshes){group.remove(mesh);mesh.geometry.dispose();mesh.material.dispose();}meshes.length=0;}
 function build(product:Product,configuration:Configuration){const data=createBoardMesh(product,configuration);const changed=Math.abs(length-data.length)>.0001||Math.abs(width-data.width)>.0001;length=data.length;width=data.width;thickness=data.thickness;if(changed)targetZoom=zoom=1;clear();const color=data.seed%3===0?0xd6d1c4:data.seed%3===1?0xf2deba:0xe0d9c9;
  for(const part of data.parts){if(!part.positions.length)continue;const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(part.positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(part.normals,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(part.uvs,2));geometry.computeBoundingSphere();const material=new THREE.MeshStandardMaterial({color:part.material===0?color:part.material===1?0x736351:0xb8976d,roughness:part.material===0?(configuration.sanding?.68:.94):.98,metalness:0,side:THREE.FrontSide,map:part.material===0?texture:null,bumpMap:part.material===0?texture:null,bumpScale:configuration.sanding?.0003:.0015});const mesh=new THREE.Mesh(geometry,material);group.add(mesh);meshes.push(mesh);}
 }
 build(p,c);
 const loader=new THREE.TextureLoader();loader.load(textureSrc,loaded=>{if(disposed){loaded.dispose();return;}texture=loaded;texture.colorSpace=THREE.SRGBColorSpace;texture.flipY=false;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());for(const mesh of meshes)if(mesh.material.color.getHex()!==0x736351&&mesh.material.color.getHex()!==0xb8976d){mesh.material.map=texture;mesh.material.bumpMap=texture;mesh.material.needsUpdate=true;}invalidate();},undefined,()=>{if(!disposed)invalidate();});
 const resize=new ResizeObserver(entries=>{const rect=entries[0]?.contentRect;if(!rect||rect.width<1||rect.height<1)return;camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();renderer.setSize(rect.width,rect.height,false);invalidate();});resize.observe(host);
 const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(visible)invalidate();else{cancelAnimationFrame(frame);frame=0;last=0;}});intersection.observe(host);
 function hidden(){if(document.hidden){cancelAnimationFrame(frame);frame=0;}else invalidate();}
 const distance=()=>{const list=Array.from(pointers.values());return list.length===2?Math.hypot(list[0].x-list[1].x,list[0].y-list[1].y):0;};
 function down(e:PointerEvent){if(e.button!==0)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});canvas.setPointerCapture(e.pointerId);pinch=distance();canvas.classList.add('is-dragging');}
 function move(e:PointerEvent){const point=pointers.get(e.pointerId);if(!point)return;const dx=e.clientX-point.x,dy=e.clientY-point.y;point.x=e.clientX;point.y=e.clientY;if(pointers.size===2){const next=distance();if(pinch>1&&next>1)targetZoom=Math.max(.45,Math.min(2.6,targetZoom*pinch/next));pinch=next;}else{targetAz-=dx*.009;targetElevation=Math.max(-1.35,Math.min(1.55,targetElevation+dy*.008));}invalidate();}
 function up(e:PointerEvent){pointers.delete(e.pointerId);if(canvas.hasPointerCapture(e.pointerId))canvas.releasePointerCapture(e.pointerId);pinch=distance();if(!pointers.size)canvas.classList.remove('is-dragging');}
 function lost(e:Event){e.preventDefault();if(!disposed)onError();}
 canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);canvas.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',hidden);invalidate();
 return {update:(product,configuration)=>{needsModel={p:product,c:configuration};invalidate();},view:v=>{targetAz=v==='edge'?Math.PI/2:v==='top'?0:.3;targetElevation=v==='edge'?.12:v==='top'?1.55:.8;targetZoom=1;invalidate();},rotate:()=>{targetAz+=Math.PI/6;invalidate();},zoom:factor=>{targetZoom=Math.min(2.6,Math.max(.45,targetZoom*factor));invalidate();},dispose:()=>{disposed=true;cancelAnimationFrame(frame);resize.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',hidden);canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('webglcontextlost',lost);pointers.clear();clear();texture?.dispose();scene.clear();renderer.dispose();renderer.forceContextLoss();canvas.remove();}};
}
