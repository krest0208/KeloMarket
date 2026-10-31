import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

const git=(...args)=>execFileSync('git',args,{maxBuffer:32*1024*1024});
const config=JSON.parse(readFileSync('.openai/github.json','utf8'));
const commit=git('rev-parse','HEAD').toString().trim();
const sourceTree=git('rev-parse','HEAD^{tree}').toString().trim();
const denied=/(^|\/)(?:\.env(?:\..*)?|\.dev\.vars(?:\..*)?|node_modules|dist|\.wrangler|\.sites-runtime|work|\.git)(?:\/|$)/;
const secret=/(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|sk-(?:proj-)?[A-Za-z0-9_-]{40,})/;
const files=git('ls-tree','-rz','HEAD').toString().split('\0').filter(Boolean).map(line=>{
 const [meta,path]=line.split('\t');const [mode,type,sha]=meta.split(' ');
 if(type!=='blob'||!['100644','100755'].includes(mode))throw new Error(`Unsupported source entry: ${path}`);
 if(denied.test(path))throw new Error(`Excluded local file is tracked: ${path}`);
 const bytes=git('cat-file','blob',sha);let encoding='utf-8',content;
 try{content=new TextDecoder('utf-8',{fatal:true}).decode(bytes);if(content.includes('\0'))throw new Error('binary');}catch{encoding='base64';content=bytes.toString('base64');}
 if(encoding==='utf-8'&&secret.test(content))throw new Error(`Possible secret in tracked file: ${path}`);
 return {path,mode,sha,size:bytes.length,encoding,content};
});
const batches=[];let batch=[],size=0;
for(const file of files){const weight=Buffer.byteLength(file.content);if(batch.length&&size+weight>1100000){batches.push(batch);batch=[];size=0;}batch.push(file);size+=weight;}if(batch.length)batches.push(batch);
const command=process.argv[2]||'manifest';
if(command==='manifest')process.stdout.write(JSON.stringify({repository:config.repository,branch:config.branch,source_commit:commit,source_tree:sourceTree,batches:batches.length,files:files.map(({content,...file})=>file)}));
else if(command==='batch'){const index=Number(process.argv[3]);if(!Number.isInteger(index)||index<0||index>=batches.length)throw new Error('Invalid batch number');process.stdout.write(JSON.stringify({source_commit:commit,index,files:batches[index]}));}
else throw new Error('Use manifest or batch N');
