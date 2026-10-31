import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {demoProducts} from '../lib/catalog';
import {createBoardMesh,encodeBoardGLB,fullBoardConfiguration} from '../lib/board-model';
const jpeg=new Uint8Array(readFileSync('public/models/kelo-texture.jpg'));
mkdirSync('public/models',{recursive:true});
const models=demoProducts.map(p=>{const mesh=createBoardMesh(p,fullBoardConfiguration(p));const data=encodeBoardGLB(mesh,jpeg);const path=`/models/${p.id}.glb`;writeFileSync('public'+path,data);return {id:p.id,name:p.name,path,lengthMm:Math.round(mesh.length*1000),widthMm:Math.round(mesh.width*1000),thicknessMm:Math.round(mesh.thickness*1000),demo:true};});
writeFileSync('public/models/manifest.json',JSON.stringify({description:'Демонстрационные параметрические модели. Не сканы реальных досок.',units:'millimeters',models},null,2)+'\n');
console.log(`Создано ${models.length} моделей GLB`);
