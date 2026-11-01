import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {DEFAULT_SITE_LAYOUT,MAX_CUSTOM_BLOCKS,normalizedEditorContent,safeEditorImage,validEditorContent,validSiteLayout,validSiteEditorSave,type CustomBlock} from '../lib/site-editor';
import {DEFAULT_SITE_CONTENT,SITE_CONTENT_FIELDS} from '../lib/site-content';
import {getSiteEditorSnapshot,saveSiteEditorSnapshot} from '../lib/site-editor-server';

function database(){
 const sqlite=new DatabaseSync(':memory:');
 sqlite.exec('CREATE TABLE settings(key TEXT PRIMARY KEY NOT NULL,value TEXT NOT NULL)');
 const wrap=(sql:string,args:unknown[]=[])=>({
  bind:(...params:unknown[])=>wrap(sql,params),
  all:async()=>({results:sqlite.prepare(sql).all(...args as any[])}),
  run:async()=>{const result=sqlite.prepare(sql).run(...args as any[]);return {meta:{changes:Number(result.changes)}};},
  execute:()=>{const result=sqlite.prepare(sql).run(...args as any[]);return {meta:{changes:Number(result.changes)}};},
 });
 // D1 serializes write batches; mirror that behavior instead of nesting transactions.
 let pending:Promise<unknown>=Promise.resolve();
 const db={prepare:(sql:string)=>wrap(sql),batch:(statements:ReturnType<typeof wrap>[])=>{
  const task=pending.then(()=>{sqlite.exec('BEGIN');try{const results=statements.map(statement=>statement.execute());sqlite.exec('COMMIT');return results;}catch(error){sqlite.exec('ROLLBACK');throw error;}});
  pending=task.catch(()=>undefined);return task;
 }} as unknown as D1Database;
 return {sqlite,db};
}
const custom=(changes:Partial<CustomBlock>={}):CustomBlock=>({id:'custom-local-test',type:'text',hidden:false,title:'Новый блок',text:'О натуральной древесине',image:'',alt:'',theme:'dark',align:'left',...changes});
const layout=()=>structuredClone(DEFAULT_SITE_LAYOUT);
const key=SITE_CONTENT_FIELDS[0].key;

test('Layout permits reordering and hiding known blocks without deleting their identity',()=>{
 const value=layout();value.blocks.reverse();value.blocks[0].hidden=true;value.blocks.splice(2,0,custom());
 assert.equal(validSiteLayout(value),true);
 const missing=layout();missing.blocks.pop();assert.equal(validSiteLayout(missing),false);
 const duplicate=layout();duplicate.blocks[1]={...duplicate.blocks[0]};assert.equal(validSiteLayout(duplicate),false);
 assert.equal(validSiteLayout({blocks:[...layout().blocks,{id:'unknown',type:'builtin',hidden:false}]}),false);
});
test('Layout rejects executable configuration, remote image URLs and oversized custom content',()=>{
 for(const image of ['https://example.com/a.webp','javascript:alert(1)','/images/../../file.webp','/api/images/..','/images/photo.svg','data:image/svg+xml,script'])assert.equal(safeEditorImage(image),false,image);
 assert.equal(safeEditorImage('/images/gallery/slabs-angle.webp'),true);
 assert.equal(safeEditorImage('/api/images/12345-local.webp'),true);
 assert.equal(validSiteLayout({blocks:[...layout().blocks,custom({type:'image',image:'/images/board.webp',alt:'Доска Кело'})]}),true);
 assert.equal(validSiteLayout({blocks:[...layout().blocks,custom({type:'image',image:'/images/board.webp',alt:''})]}),false);
 assert.equal(validSiteLayout({blocks:[...layout().blocks,{...custom(),html:'<script>bad()</script>'}]}),false);
 assert.equal(validSiteLayout({blocks:[...layout().blocks,custom({text:'x'.repeat(4001)})]}),false);
 assert.equal(validSiteLayout({blocks:[...layout().blocks,...Array.from({length:MAX_CUSTOM_BLOCKS+1},(_,index)=>custom({id:'custom-'+index}))]}),false);
});
test('Editor accepts only bounded registered copy and an integer revision',()=>{
 assert.equal(validEditorContent({[key]:'Новое название'}),true);
 assert.equal(validEditorContent({[key]:' '}),false);
 assert.equal(validEditorContent({unknown:'text'}),false);
 assert.equal(validEditorContent({[key]:'x'.repeat(4001)}),false);
 for(const expectedRevision of [-1,1.5,Infinity,Number.MAX_SAFE_INTEGER])assert.equal(validSiteEditorSave({expectedRevision,content:{},layout:layout()}),false);
 assert.equal(validSiteEditorSave({expectedRevision:0,content:{},layout:layout()}),true);
 const content=normalizedEditorContent({[key]:'Сохранено',unknown:'ignored'});
 assert.equal(content[key],'Сохранено');assert.equal('unknown' in content,false);
 assert.equal(Object.keys(content).length,Object.keys(DEFAULT_SITE_CONTENT).length);
});
test('A fresh site reads defaults and an atomic save persists copy, layout and revision',async()=>{
 const {sqlite,db}=database();const before=await getSiteEditorSnapshot(db);
 assert.equal(before.revision,0);assert.deepEqual(before.layout,DEFAULT_SITE_LAYOUT);
 const changed=layout();changed.blocks.reverse();changed.blocks[0].hidden=true;changed.blocks.push(custom());
 const saved=await saveSiteEditorSnapshot({expectedRevision:0,content:{[key]:'Новое название'},layout:changed},db);
 assert.equal(saved?.revision,1);assert.equal(saved?.content[key],'Новое название');assert.deepEqual(saved?.layout,changed);
 assert.deepEqual(await getSiteEditorSnapshot(db),saved);
 assert.equal('writeToken' in (await getSiteEditorSnapshot(db)),false);
 sqlite.close();
});
test('Two drafts from one revision cannot overwrite each other or mix copy with layout',async()=>{
 const {sqlite,db}=database();const a=layout(),b=layout();a.blocks[0].hidden=true;b.blocks.reverse();
 const [first,second]=await Promise.all([
  saveSiteEditorSnapshot({expectedRevision:0,content:{[key]:'First'},layout:a},db),
  saveSiteEditorSnapshot({expectedRevision:0,content:{[key]:'Second'},layout:b},db),
 ]);
 assert.equal(first?.revision,1);assert.equal(second,null);
 const saved=await getSiteEditorSnapshot(db);assert.equal(saved.content[key],'First');assert.deepEqual(saved.layout,a);assert.equal(saved.revision,1);
 assert.equal(await saveSiteEditorSnapshot({expectedRevision:0,content:{[key]:'Stale retry'},layout:b},db),null);
 assert.deepEqual(await getSiteEditorSnapshot(db),saved);
 sqlite.close();
});
test('Failed content persistence rolls back the matching layout revision',async()=>{
 const {sqlite,db}=database();
 sqlite.exec("CREATE TRIGGER deny_content BEFORE INSERT ON settings WHEN NEW.key='site-content' BEGIN SELECT RAISE(ABORT,'test rollback'); END");
 const changed=layout();changed.blocks.reverse();
 await assert.rejects(()=>saveSiteEditorSnapshot({expectedRevision:0,content:{[key]:'Changed'},layout:changed},db));
 assert.deepEqual(await getSiteEditorSnapshot(db),{revision:0,content:DEFAULT_SITE_CONTENT,layout:DEFAULT_SITE_LAYOUT});
 assert.equal(sqlite.prepare('SELECT COUNT(*) AS total FROM settings').get()!.total,0);
 sqlite.close();
});
test('Malformed persisted layout falls back safely without exposing internal metadata',async()=>{
 const {sqlite,db}=database();
 sqlite.prepare('INSERT INTO settings VALUES(?,?)').run('site-editor',JSON.stringify({revision:2,layout:{blocks:[{id:'unsafe',type:'html',html:'bad'}]},writeToken:'internal'}));
 sqlite.prepare('INSERT INTO settings VALUES(?,?)').run('site-content','invalid JSON');
 const saved=await getSiteEditorSnapshot(db);assert.equal(saved.revision,2);assert.deepEqual(saved.layout,DEFAULT_SITE_LAYOUT);assert.deepEqual(saved.content,DEFAULT_SITE_CONTENT);assert.deepEqual(Object.keys(saved).sort(),['content','layout','revision']);
 sqlite.close();
});
