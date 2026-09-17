'use strict';
const CACHE='ainnova-forest-v1';
const ROOT=new URL('./',self.location.href).href;
const FILES=['./','index.html','en.html','style.css','app.js','manifest.webmanifest','assets/skog.jpg','assets/sjon.jpg','assets/skord.jpg','assets/kantareller.jpg','assets/mossa.jpg','assets/icon-180.png','assets/icon-192.png','assets/icon-512.png','assets/icon.svg','assets/favicon.ico'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(path=>new URL(path,ROOT).href))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ainnova-forest-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||!url.href.startsWith(ROOT)||url.origin!==self.location.origin)return;
 event.respondWith(fetch(event.request).then(response=>{if(response.ok&&response.type==='basic'){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response;}).catch(async()=>{const cached=await caches.match(event.request);if(cached)return cached;if(event.request.mode==='navigate'){return await caches.match(new URL(url.pathname.endsWith('en.html')?'en.html':'index.html',ROOT).href);}return Response.error();}));
});
