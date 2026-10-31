import type {Product} from './catalog';

export interface GalleryPhoto {src:string;thumb:string;caption:string;alt:string;demo:boolean}
export type PhotoGroup='slabs'|'shelves'|'blanks';
const photo=(id:string,caption:string,subject:string):GalleryPhoto=>({src:`/images/gallery/${id}.webp`,thumb:`/images/gallery/${id}-thumb.webp`,caption,alt:`${subject}. ${caption}. Демонстрационное изображение.`,demo:true});
export const categoryPhotoSets:Record<PhotoGroup,GalleryPhoto[]>={
 slabs:[{src:'/images/quiet-hero.webp',thumb:'/images/quiet-hero.webp',caption:'Природная форма',alt:'Слэб Кело с живым краем на тёмном камне — пример',demo:true},photo('slabs-angle','Другой ракурс','Слэб сосны Кело'),photo('slabs-top','Вид сверху','Слэб сосны Кело'),photo('slabs-edge','Живой край','Слэб сосны Кело'),photo('slabs-knot','Текстура','Слэб сосны Кело'),photo('slabs-room','Идея в интерьере','Слэб сосны Кело')],
 shelves:[{src:'/images/quiet-shelf.webp',thumb:'/images/quiet-shelf.webp',caption:'Полка из массива',alt:'Навесная полка Кело на тёмной стене — пример',demo:true},photo('shelves-front','Вид спереди','Навесная полка Кело'),photo('shelves-angle','Другой ракурс','Навесная полка Кело'),photo('shelves-edge','Деталь края','Навесная полка Кело'),photo('shelves-grain','Рисунок массива','Навесная полка Кело'),photo('shelves-room','В пространстве','Навесная полка Кело')],
 blanks:[{src:'/images/quiet-blanks.webp',thumb:'/images/quiet-blanks.webp',caption:'Натуральный материал',alt:'Заготовки из сосны Кело на тёмном фоне — пример',demo:true},photo('blanks-stack','Заготовки','Заготовки из сосны Кело'),photo('blanks-top','Вид сверху','Заготовка из сосны Кело'),photo('blanks-end','Торец','Заготовки из сосны Кело'),photo('blanks-workshop','В мастерской','Заготовка из сосны Кело'),photo('blanks-sill','Идея для дома','Заготовка из сосны Кело')],
};
export function photoGroup(category:string):PhotoGroup{return category==='slabs'?'slabs':category==='shelves'||category==='mantels'?'shelves':'blanks';}
const covers:Record<string,number>={'KL-001':1,'KL-002':2,'KL-003':3,'PL-001':1,'KM-001':2,'PD-001':1,'ST-001':2,'DK-001':3};
export function productPhotoSet(p:Product):GalleryPhoto[]{
 const photos=categoryPhotoSets[photoGroup(p.category)];
 if(p.image.startsWith('/api/images/'))return [{src:p.image,thumb:p.image,caption:'Фото изделия',alt:p.name,demo:false},...photos.slice(1)];
 const start=covers[p.id]??1;
 return [...photos.slice(start),...photos.slice(0,start)];
}
export const editorialImages={hero:'/images/gallery/home-hero.webp',grain:'/images/gallery/home-grain.webp',edge:'/images/gallery/home-edge.webp',shelf:'/images/gallery/home-shelf.webp',materialEdge:'/images/gallery/material-edge.webp',thickness:'/images/gallery/material-thickness.webp',long:'/images/gallery/material-long.webp'};
export const projectExamples=[
 {title:'Журнальный стол',image:'/images/interior.webp',description:'Слэб с живым краем и лаконичное подстолье. Природная фактура становится главным акцентом комнаты.',href:'/catalog?category=tops',action:'Выбрать заготовку'},
 {title:'Консоль для прихожей',image:'/images/gallery/project-console.webp',description:'Неглубокая столешница из массива и тонкие опоры. Место для вещей, которые хочется оставить на виду.',href:'/catalog?category=tops',action:'Подобрать материал'},
 {title:'Подоконник из массива',image:'/images/gallery/project-window.webp',description:'Тёплая деревянная поверхность у окна. Прямой задний спил и живой край со стороны комнаты.',href:'/catalog?category=sills',action:'Для подоконников'},
];
