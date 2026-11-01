'use client';
import type {ReactNode} from 'react';
import type {HomeBlockId} from '@/lib/site-editor';
import {CustomBlockText,useSiteContent} from '@/components/site-content';

/** Fixed shop components keep their real functionality when the owner changes page order. */
export function HomeBlocks({blocks}:{blocks:Record<HomeBlockId,ReactNode>}){
 const {layout,frame}=useSiteContent();
 return <>{layout.blocks.filter(block=>!block.hidden).map(block=><div key={block.id} data-site-block={block.id} className={'kelo-page-block'+(frame.enabled&&frame.mode==='edit'&&frame.selectedBlock===block.id?' is-selected':'')}>
  {block.type==='builtin'?blocks[block.id]:<section className={`section kelo-custom-block theme-${block.theme} align-${block.align}`}><div className="container">
   {block.type==='image'&&<img src={block.image} alt={block.alt} loading="lazy" width="1536" height="1024"/>}
   {(block.title||frame.enabled)&&<h2><CustomBlockText blockId={block.id} field="title" value={block.title}/></h2>}
   {(block.text||frame.enabled)&&<p><CustomBlockText blockId={block.id} field="text" value={block.text}/></p>}
  </div></section>}
 </div>)}</>;
}
