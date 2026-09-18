import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
for(const file of ['index.html','en.html']){
 const html=read(file);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
 assert.equal(new Set(ids).size,ids.length,`${file}: duplicate IDs`);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.match(html, /Content-Security-Policy/);
 assert.match(html, /<html lang="(sv|en)">/);
 for(const [,ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(ref.startsWith('#')){if(ref.length>1)assert(ids.includes(ref.slice(1)),`Missing anchor ${ref}`);}
  else if(!/^(https?:|tel:|data:)/.test(ref))assert(existsSync(new URL(ref,root)),`Missing asset ${ref}`);
 }
 for(const [img] of html.matchAll(/<img\b[^>]*>/g))assert.match(img,/alt="[^"]+"/);
 assert.match(html,/rel="canonical" href="https:\/\/annamalmberg2.github.io\/ainnova-host-i-skogen\//);
}
const manifest=JSON.parse(read('manifest.webmanifest'));
assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./');assert.equal(manifest.display,'standalone');
for(const icon of manifest.icons){const b=readFileSync(new URL(icon.src,root));assert.equal(b.readUInt32BE(16),Number(icon.sizes.split('x')[0]));}
const listeners={};const cacheStore=new Map();let network=0;
const scope='https://example.test/ainnova-host-i-skogen/';
const foreign='ainnova:/another-site/:v1';cacheStore.set(foreign,new Map());cacheStore.set('ainnova:/ainnova-host-i-skogen/:obsolete',new Map());
const caches={keys:async()=>[...cacheStore.keys()],delete:async k=>cacheStore.delete(k),open:async k=>{
 if(!cacheStore.has(k))cacheStore.set(k,new Map());const entries=cacheStore.get(k);
 return {addAll:async urls=>{for(const u of urls){assert(existsSync(new URL(u===scope?'index.html':u.slice(scope.length),root)));entries.set(u,{url:u,ok:true});}},match:async u=>entries.get(u)};
}};
vm.runInNewContext(read('sw.js'),{URL,Set,caches,fetch:async()=>{network++;throw Error('offline');},self:{location:{href:scope+'sw.js'},clients:{claim:async()=>{}},addEventListener:(name,fn)=>listeners[name]=fn}});
async function lifecycle(name){let done;listeners[name]({waitUntil:p=>done=p});await done;}
await lifecycle('install');await lifecycle('activate');assert(cacheStore.has(foreign),'Must preserve other apps');assert(!cacheStore.has('ainnova:/ainnova-host-i-skogen/:obsolete'));
async function request(path,method='GET'){let response;listeners.fetch({request:{url:new URL(path,scope).href,method},respondWith:p=>response=p});return response?await response:undefined;}
for(const path of ['./','en.html','style.css','assets/skog.jpg','?utm_source=share'])assert((await request(path)).ok,`Offline resource ${path}`);
assert.equal(network,0,'Cached content must not wait for the network');
assert.equal(await request('missing-page'),undefined,'Do not mask 404s with the home page');
assert.equal(await request('en.html','POST'),undefined);
assert.equal(await request('https://example.test/another-site/'),undefined);
assert(!read('sw.js').includes('self.skipWaiting('),'Do not replace an active release mid-visit');
console.log('PASS: HTML assets/anchors/languages/CSP, manifest/PNG dimensions, offline SV/EN/assets, query URLs, cache isolation, unknown routes, POST and release lifecycle.');
