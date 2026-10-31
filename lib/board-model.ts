import earcut from 'earcut';
import type {Product, Configuration} from './catalog';

type Point=[number,number];
export interface ModelPart {positions:number[];normals:number[];uvs:number[];material:number}
export interface BoardMesh {parts:ModelPart[];length:number;width:number;thickness:number;seed:number;outline:Point[];holes:Point[][];configuration:Configuration;productId:string}
export function boardSeed(id:string){let n=2166136261;for(let i=0;i<id.length;i++)n=Math.imul(n^id.charCodeAt(i),16777619);return n>>>0;}
export function fullBoardConfiguration(p:Product):Configuration{return {productId:p.id,type:p.category==='shelves'||p.category==='mantels'?'shelf':p.category==='slabs'?'slab':'blank',length:p.maxLength,thickness:p.thickness,sanding:false,cut:false,side:'left',holes:0};}
export function createBoardMesh(p:Product,c:Configuration=fullBoardConfiguration(p)):BoardMesh{
 const length=Math.max(.03,Math.min(6,c.length/100)),width=Math.max(.05,(c.width??p.width)/100),thickness=c.thickness/1000,seed=boardSeed(p.id),phase=(seed%1000)/1000*Math.PI*2;
 const outline:Point[]=[],segments=Math.max(18,Math.min(100,Math.ceil(c.length/5)));
 const edge=(t:number,side:number)=>{const u=t*c.length/Math.max(1,p.maxLength);const wave=(Math.sin(u*22+phase+side)*.45+Math.sin(u*61+phase*1.7+side*3)*.22+Math.sin(u*137+phase*.8)*.09);return width*(.045+.035*wave);};
 for(let i=0;i<=segments;i++){const t=i/segments;outline.push([-length/2+t*length,-width/2+(c.cut&&c.side==='left'?0:edge(t,0))]);}
 for(let i=segments;i>=0;i--){const t=i/segments;outline.push([-length/2+t*length,width/2-(c.cut&&c.side==='right'?0:edge(t,1))]);}
 const holes:Point[][]=[];const radius=Math.min(.005,length*.035,width*.035);
 for(let i=0;i<c.holes;i++){const ring:Point[]=[];const x=-length/2+length*(i+1)/(c.holes+1);for(let j=0;j<24;j++){const a=-j/24*Math.PI*2;ring.push([x+radius*Math.cos(a),radius*Math.sin(a)]);}holes.push(ring);}
 const top:ModelPart={positions:[],normals:[],uvs:[],material:0},side:ModelPart={positions:[],normals:[],uvs:[],material:1},ends:ModelPart={positions:[],normals:[],uvs:[],material:2};
 const all=[...outline,...holes.flat()],flat=all.flat(),holeStarts:number[]=[];let start=outline.length;for(const ring of holes){holeStarts.push(start);start+=ring.length;}
 const indices=earcut(flat,holeStarts,2);
 const topUv=(v:number[])=>{let u=(v[0]/length+.5);if(seed%2)u=1-u;return [.04+u*.92,.425+(v[2]/width+.5)*.15];};
 const triangle=(part:ModelPart,a:number[],b:number[],d:number[],uv?:number[][])=>{
  const ab=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],ac=[d[0]-a[0],d[1]-a[1],d[2]-a[2]],n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]],size=Math.hypot(...n);
  if(size<1e-12)return;for(let i=0;i<3;i++){const v=[a,b,d][i];part.positions.push(...v);part.normals.push(n[0]/size,n[1]/size,n[2]/size);part.uvs.push(...(uv?uv[i]:topUv(v)));}
 };
 for(let i=0;i<indices.length;i+=3){let a=all[indices[i]],b=all[indices[i+1]],d=all[indices[i+2]];if((b[0]-a[0])*(d[1]-a[1])-(b[1]-a[1])*(d[0]-a[0])>0)[b,d]=[d,b];triangle(top,[a[0],thickness/2,a[1]],[b[0],thickness/2,b[1]],[d[0],thickness/2,d[1]]);triangle(top,[d[0],-thickness/2,d[1]],[b[0],-thickness/2,b[1]],[a[0],-thickness/2,a[1]]);}
 for(const ring of [outline,...holes]){
  for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length];const cutEnd=Math.abs(a[0]-b[0])<1e-8;const straight=c.cut&&((c.side==='left'&&a[1]===-width/2&&b[1]===-width/2)||(c.side==='right'&&a[1]===width/2&&b[1]===width/2));const part=ring!==outline||cutEnd||straight?ends:side;
   const ta=[a[0],thickness/2,a[1]],ba=[a[0],-thickness/2,a[1]],tb=[b[0],thickness/2,b[1]],bb=[b[0],-thickness/2,b[1]];triangle(part,ta,tb,ba);triangle(part,tb,bb,ba);
  }
 }
 return {parts:[top,side,ends],length,width,thickness,seed,outline,holes,configuration:{...c},productId:p.id};
}
export function encodeBoardGLB(mesh:BoardMesh,jpeg?:Uint8Array):Uint8Array<ArrayBuffer>{
 const chunks:Uint8Array[]=[];const views:any[]=[],accessors:any[]=[],primitives:any[]=[];let offset=0;
 const add=(bytes:Uint8Array,target?:number)=>{const padded=new Uint8Array(Math.ceil(bytes.byteLength/4)*4);padded.set(bytes);const index=views.length;views.push({buffer:0,byteOffset:offset,byteLength:bytes.byteLength,...(target?{target}:{})});chunks.push(padded);offset+=padded.byteLength;return index;};
 const attribute=(values:number[],type:'VEC3'|'VEC2',bounds=false)=>{const array=new Float32Array(values);const view=add(new Uint8Array(array.buffer),34962);const stride=type==='VEC3'?3:2;const entry:any={bufferView:view,componentType:5126,count:values.length/stride,type};if(bounds){entry.min=[Infinity,Infinity,Infinity];entry.max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<values.length;i++){entry.min[i%3]=Math.min(entry.min[i%3],values[i]);entry.max[i%3]=Math.max(entry.max[i%3],values[i]);}}accessors.push(entry);return accessors.length-1;};
 for(const part of mesh.parts){if(!part.positions.length)continue;primitives.push({attributes:{POSITION:attribute(part.positions,'VEC3',true),NORMAL:attribute(part.normals,'VEC3'),TEXCOORD_0:attribute(part.uvs,'VEC2')},material:part.material,mode:4});}
 const imageView=jpeg?add(jpeg):undefined;const rough=mesh.configuration.sanding?.68:.94;const color=mesh.seed%3===0?[.84,.82,.77,1]:mesh.seed%3===1?[.95,.87,.73,1]:[.88,.85,.79,1];
 const data={asset:{version:'2.0',generator:'KELO WOOD MARKET',copyright:'Demonstration geometry and texture'},scene:0,scenes:[{nodes:[0]}],nodes:[{mesh:0,name:mesh.productId}],meshes:[{name:mesh.productId,primitives,extras:{demo:true,lengthMm:mesh.length*1000,widthMm:mesh.width*1000,thicknessMm:mesh.thickness*1000,holes:mesh.holes.length,configuration:mesh.configuration}}],materials:[{name:'Kelo grain',pbrMetallicRoughness:{baseColorFactor:color,metallicFactor:0,roughnessFactor:rough,...(jpeg?{baseColorTexture:{index:0}}:{})}},{name:'Natural live edge',pbrMetallicRoughness:{baseColorFactor:[.32,.27,.21,1],metallicFactor:0,roughnessFactor:.98}},{name:'Cut pine',pbrMetallicRoughness:{baseColorFactor:[.58,.45,.31,1],metallicFactor:0,roughnessFactor:.9}}],bufferViews:views,accessors,buffers:[{byteLength:offset}],...(jpeg?{images:[{bufferView:imageView,mimeType:'image/jpeg'}],textures:[{source:0,sampler:0}],samplers:[{magFilter:9729,minFilter:9987,wrapS:33071,wrapT:33071}]}:{})};
 const json=new TextEncoder().encode(JSON.stringify(data));const jsonSize=Math.ceil(json.length/4)*4,total=12+8+jsonSize+8+offset,out=new Uint8Array(total),header=new DataView(out.buffer);header.setUint32(0,0x46546c67,true);header.setUint32(4,2,true);header.setUint32(8,total,true);header.setUint32(12,jsonSize,true);header.setUint32(16,0x4e4f534a,true);out.fill(32,20,20+jsonSize);out.set(json,20);header.setUint32(20+jsonSize,offset,true);header.setUint32(24+jsonSize,0x004e4942,true);let at=28+jsonSize;for(const chunk of chunks){out.set(chunk,at);at+=chunk.byteLength;}return out;
}
