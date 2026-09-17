'use strict';
(() => {
 const en=document.documentElement.lang==='en';
 const msg=(sv,eng)=>en?eng:sv;
 const status=document.querySelector('#status');
 const read=(key)=>{try{return localStorage.getItem(key)==='true';}catch{return false;}};
 for(const [id,cls] of [['text-size','large-text'],['contrast','high-contrast']]){
  const button=document.getElementById(id);button.hidden=false;
  const apply=(on)=>{document.documentElement.classList.toggle(cls,on);button.setAttribute('aria-pressed',String(on));};
  apply(read('ainnova-'+cls));
  button.addEventListener('click',()=>{const on=button.getAttribute('aria-pressed')!=='true';apply(on);try{localStorage.setItem('ainnova-'+cls,String(on));}catch{}});
 }
 const install=document.getElementById('install');install.hidden=false;
 const dialog=document.getElementById('install-help');let deferred;
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferred=event;});
 install.addEventListener('click',async()=>{if(deferred){const event=deferred;deferred=null;try{await event.prompt();}catch{dialog.showModal();}}else{dialog.showModal();}});
 window.addEventListener('appinstalled',()=>{deferred=null;status.textContent=msg('Appen är installerad.','App installed.');});
 const share=document.getElementById('share');share.hidden=false;
 share.addEventListener('click',async()=>{
  const url=document.querySelector('link[rel=canonical]').href;
  try{if(navigator.share){await navigator.share({title:document.title,url});}else if(navigator.clipboard){await navigator.clipboard.writeText(url);status.textContent=msg('Länken är kopierad.','Link copied.');share.textContent=msg('Länk kopierad!','Link copied!');}else{status.textContent=msg('Kopiera länken från adressfältet.','Copy the link from your address bar.');}}
  catch(error){if(error.name!=='AbortError')status.textContent=msg('Kopiera länken från adressfältet för att dela.','Copy the link from your address bar to share.');}
 });
 if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js').then(async reg=>{
   await navigator.serviceWorker.ready;
   const note=document.getElementById('offline-note');
   note.textContent=msg('Sidan är sparad för offlineläsning på den här enheten. Externa länkar och kontakt kräver anslutning.','This page is saved for offline reading on this device. External links and contacting Anna require a connection.');
  }).catch(()=>{status.textContent=msg('Sidan fungerar, men kunde inte sparas offline.','The page works, but could not be saved offline.');});
 }
})();
