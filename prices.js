'use strict';
(() => {
 const API='https://script.google.com/macros/s/AKfycby-8qO-v4bYVnwE42iMdmEQfCD1Orj1zGhWrKDZ_E43LywKapYWnT0216esSrTa3Yys/exec';
 const KEY='ainnova-adventure-prices-v2';
 const en=document.documentElement.lang==='en';
 const t=(sv,english)=>en?english:sv;
 const status=document.getElementById('prices-status');
 const results=document.getElementById('price-results');
 const select=document.getElementById('price-category');
 const refresh=document.getElementById('price-refresh');
 if(!results)return;
 let categories=[];let fetchedAt=null;let running=false;
 const labels={'Rådgivning & Utbildning':'Advice & training','Alltid':'General terms','Standard':'Standard services','Övrigt':'Other services','Företags-lösningar':'Business solutions','Starta eget företag':'Starting a business','Webb & E-handel':'Web & e-commerce','Kartor & automation':'Maps & automation','Special-designat med API':'Custom API solutions','Innehålls-skapande & Verktyg':'Content & tools','Extra':'Additional services'};
 const categoryLabel=name=>en&&Object.prototype.hasOwnProperty.call(labels,name)?labels[name]:name;
 const str=value=>typeof value==='string'?value.trim().slice(0,4000):typeof value==='number'?String(value):'';
 function validate(data){
  if(!data||data.success===false||!Array.isArray(data.categories))throw Error('Invalid price feed');
  const filtered=data.categories.filter(c=>c&&str(c.name)&&Array.isArray(c.services)).map(c=>({name:str(c.name),services:c.services.filter(s=>s&&str(s.tjanst)&&str(s.pris)).map(s=>({tjanst:str(s.tjanst),pris:str(s.pris),beskrivning:str(s.beskrivning),lank:str(s.lank)}))})).filter(c=>c.services.length);
  if(!filtered.length)throw Error('Empty price feed');return filtered;
 }
 function el(tag,text,cls){const node=document.createElement(tag);if(text)node.textContent=text;if(cls)node.className=cls;return node;}
 function safeLink(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u.href:null;}catch{return null;}}
 function render(){
  results.replaceChildren();
  const chosen=categories.filter(c=>select.value==='all'||c.name===select.value);
  const count=document.getElementById('price-count');
  if(count){const total=categories.reduce((n,c)=>n+c.services.length,0);const shown=chosen.reduce((n,c)=>n+c.services.length,0);count.textContent=select.value==='all'?t(`Hela prislistan: ${total} tjänster i ${categories.length} kategorier.`,`Full catalogue: ${total} services in ${categories.length} categories.`):t(`Visar ${shown} av ${total} tjänster. Välj Alla kategorier för hela prislistan.`,`Showing ${shown} of ${total} services. Choose All categories for the full catalogue.`);}
  for(const category of chosen){
   const group=el('section',null,'service-group');
   group.append(el('h3',categoryLabel(category.name)));
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
 function syncAdventure(stale=false){
  const service=categories.find(c=>c.name==='Rådgivning & Utbildning')?.services.find(s=>s.tjanst.normalize('NFC').toLocaleLowerCase('sv-SE')==='äventyret');
  const note=document.getElementById('adventure-price-status');
  if(!note)return;
  if(service){
   for(const node of document.querySelectorAll('[data-adventure-price]')){node.textContent=service.pris;node.lang='sv';}
   note.textContent=stale?t('Sparat pris från ','Saved price from ')+timeLabel()+t('. Bekräfta med Anna.','. Please confirm with Anna.'):t('Fyra timmar för en person.','Four hours for one person.');
  }else note.textContent=t('Äventyret kunde inte hittas i prislistan. Visar tidigare grundpris; bekräfta med Anna.','The Adventure could not be found in the price list. Showing the previous base price; please confirm with Anna.');
 }
 function adopt(data,time){
  categories=validate(data);fetchedAt=time;
  const previous=select.value;
  select.replaceChildren(new Option(t('Alla kategorier','All categories'),'all'));
  for(const category of categories)select.add(new Option(categoryLabel(category.name),category.name));
  if([...select.options].some(o=>o.value===previous))select.value=previous;
  document.querySelector('.price-controls').hidden=false;render();syncAdventure(true);
 }
 function timeLabel(){return new Intl.DateTimeFormat(en?'en-GB':'sv-SE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(fetchedAt));}
 async function load(){
  if(running)return;running=true;refresh.disabled=true;results.setAttribute('aria-busy','true');
  status.textContent=t('Hämtar aktuella priser…','Loading the latest prices…');
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
  try{
   const response=await fetch(API,{signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer',cache:'no-store'});
   if(!response.ok)throw Error('Price request failed');
   const data=await response.json();adopt(data,Date.now());syncAdventure();
   try{localStorage.setItem(KEY,JSON.stringify({categories,fetchedAt}));}catch{}
   status.textContent=t('Hämtat från den gemensamma prislistan: ','Fetched from the shared price list: ')+timeLabel()+'.';
  }catch{
   if(categories.length)syncAdventure(true);
   status.textContent=categories.length?t('Kunde inte hämta nya priser. Visar sparad prislista från ','Could not fetch new prices. Showing the saved list from ')+timeLabel()+t('. Bekräfta aktuellt pris med Anna.','. Confirm the current price with Anna.'):t('Prislistan går inte att hämta just nu. Försök igen eller kontakta Anna för aktuella priser.','The price list is unavailable. Try again or contact Anna for current prices.');
   document.querySelector('.price-controls').hidden=false;select.disabled=!categories.length;
  }finally{clearTimeout(timer);running=false;refresh.disabled=false;select.disabled=!categories.length;results.setAttribute('aria-busy','false');}
 }
 select.addEventListener('change',render);refresh.addEventListener('click',load);
 try{const cached=JSON.parse(localStorage.getItem(KEY));if(cached&&Number.isFinite(cached.fetchedAt)&&cached.fetchedAt>0&&cached.fetchedAt<=Date.now())adopt(cached,cached.fetchedAt);}catch{}
 // The shared offer price is visible in the hero, so refresh on page load.
 load();
})();
