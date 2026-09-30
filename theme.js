'use strict';
(() => {
 const root=document.documentElement;
 const preference=window.matchMedia('(prefers-color-scheme: dark)');
 let saved=null;
 try{const value=localStorage.getItem('ainnova-theme');if(value==='light'||value==='dark')saved=value;}catch{}
 function apply(value){root.dataset.theme=value;}
 apply(saved||(preference.matches?'dark':'light'));
 document.addEventListener('DOMContentLoaded',()=>{
  const button=document.getElementById('theme-toggle');
  if(!button)return;
  const en=root.lang==='en';
  const paint=()=>{const dark=root.dataset.theme==='dark';button.textContent=dark?(en?'Light theme':'Ljust tema'):(en?'Dark theme':'Mörkt tema');};
  button.hidden=false;paint();
  button.addEventListener('click',()=>{saved=root.dataset.theme==='dark'?'light':'dark';apply(saved);paint();try{localStorage.setItem('ainnova-theme',saved);}catch{}});
  preference.addEventListener('change',event=>{if(!saved){apply(event.matches?'dark':'light');paint();}});
 });
})();
