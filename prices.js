'use strict';
(() => {
 const API='https://script.google.com/macros/s/AKfycby-8qO-v4bYVnwE42iMdmEQfCD1Orj1zGhWrKDZ_E43LywKapYWnT0216esSrTa3Yys/exec';
 const ALLOWED=['Rådgivning & Utbildning','Alltid','Standard','Övrigt'];
 const KEY='ainnova-forest-prices-v1';
 const en=document.documentElement.lang==='en';
 const t=(sv,english)=>en?english:sv;
 const status=document.getElementById('prices-status');
 const results=document.getElementById('price-results');
 const select=document.getElementById('price-category');
 const refresh=document.getElementById('price-refresh');
 if(!results)return;
 let categories=[];let fetchedAt=null;let running=false;
 const labels={'Rådgivning & Utbildning':'Advice & training','Alltid':'General terms','Standard':'Standard services','Övrigt':'Other services'};
 const str=value=>typeof value==='string'?value.trim().slice(0,4000):typeof value==='number'?String(value):'';
 function validate(data){
  if(!data||data.success===false||!Array.isArray(data.categories))throw Error('Invalid price feed');
  const filtered=data.categories.filter(c=>c&&ALLOWED.includes(c.name)&&Array.isArray(c.services)).map(c=>({name:c.name,services:c.services.slice(0,100).filter(s=>s&&str(s.tjanst)&&str(s.pris)).map(s=>({tjanst:str(s.tjanst),pris:str(s.pris),beskrivning:str(s.beskrivning),lank:str(s.lank)}))})).filter(c=>c.services.length);
  if(!filtered.length)throw Error('Empty price feed');return filtered;
 }
 function el(tag,text,cls){const node=document.createElement(tag);if(text)node.textContent=text;if(cls)node.className=cls;return node;}
 function safeLink(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
 function render(){
  results.replaceChildren();
  const chosen=categories.filter(c=>select.value==='all'||c.name===select.value);
  for(const category of chosen){
   const group=el('section',null,'service-group');
   group.append(el('h3',en?labels[category.name]:category.name));
   const list=el('div',null,'service-list');
   for(const service of category.services){
    const card=el('article',null,'service-item');card.lang='sv';
    const head=el('h4');const url=safeLink(service.lank);
    if(url){const a=el('a',service.tjanst);a.href=url;head.append(a);}else head.textContent=service.tjanst;
    card.append(head,el('p',service.pris,'service-price'),el('p',service.beskrivning));list.append(card);
   }
   group.append(list);results.append(group);
  }
 }
 function adopt(data,time){
  categories=validate(data);fetchedAt=time;
  const previous=select.value;
  select.replaceChildren(new Option(t('Alla i urvalet','All selected categories'),'all'));
  for(const category of categories)select.add(new Option(en?labels[category.name]:category.name,category.name));
  if([...select.options].some(o=>o.value===previous))select.value=previous;
  document.querySelector('.price-controls').hidden=false;render();
 }
 function timeLabel(){return new Intl.DateTimeFormat(en?'en-GB':'sv-SE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(fetchedAt));}
 async function load(){
  if(running)return;running=true;refresh.disabled=true;results.setAttribute('aria-busy','true');
  status.textContent=t('Hämtar aktuella priser…','Loading the latest prices…');
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
  try{
   const response=await fetch(API,{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store'});
   if(!response.ok)throw Error('Price request failed');
   const data=await response.json();adopt(data,Date.now());
   try{localStorage.setItem(KEY,JSON.stringify({categories,fetchedAt}));}catch{}
   status.textContent=t('Hämtat från den gemensamma prislistan: ','Fetched from the shared price list: ')+timeLabel()+'.';
  }catch{
   status.textContent=categories.length?t('Kunde inte hämta nya priser. Visar sparad prislista från ','Could not fetch new prices. Showing the saved list from ')+timeLabel()+t('. Bekräfta aktuellt pris med Anna.','. Confirm the current price with Anna.'):t('Prislistan går inte att hämta just nu. Försök igen eller kontakta Anna för aktuella priser.','The price list is unavailable. Try again or contact Anna for current prices.');
   document.querySelector('.price-controls').hidden=false;select.disabled=!categories.length;
  }finally{clearTimeout(timer);running=false;refresh.disabled=false;select.disabled=!categories.length;results.setAttribute('aria-busy','false');}
 }
 select.addEventListener('change',render);refresh.addEventListener('click',load);
 try{const cached=JSON.parse(localStorage.getItem(KEY));if(cached&&Number.isFinite(cached.fetchedAt)&&cached.fetchedAt>0&&cached.fetchedAt<=Date.now())adopt(cached,cached.fetchedAt);}catch{}
 // Loading at the section keeps the first screen fast; only the public feed is requested.
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();load();}},{rootMargin:'300px'});observer.observe(document.getElementById('prislista'));}else load();
})();
