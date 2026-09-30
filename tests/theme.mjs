import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../theme.js',import.meta.url),'utf8');
function run({saved=null,dark=false,denied=false}={}){
 const root={dataset:{},lang:'sv'};const handlers={};const attributes={};const button={setAttribute:(k,v)=>attributes[k]=v,addEventListener:(e,f)=>handlers[e]=f};let ready,change,stored;
 vm.runInNewContext(source,{document:{documentElement:root,addEventListener:(e,f)=>ready=f,getElementById:()=>button},window:{matchMedia:()=>({matches:dark,addEventListener:(e,f)=>change=f})},localStorage:{getItem:()=>{if(denied)throw Error();return saved;},setItem:(k,v)=>{if(denied)throw Error();stored=v;}}});
 ready();return {root,button,attributes,click:()=>handlers.click(),system:value=>change({matches:value}),stored:()=>stored};
}
let t=run({dark:true});assert.equal(t.root.dataset.theme,'dark');t.system(false);assert.equal(t.root.dataset.theme,'light');t.click();assert.equal(t.root.dataset.theme,'dark');assert.equal(t.stored(),'dark');t.system(false);assert.equal(t.root.dataset.theme,'dark','Explicit choice wins over OS');
t=run({saved:'light',dark:true});assert.equal(t.root.dataset.theme,'light');t.click();assert.equal(t.button.textContent,'Ljust tema');
t=run({saved:'invalid',dark:true});assert.equal(t.root.dataset.theme,'dark');
t=run({denied:true});t.click();assert.equal(t.root.dataset.theme,'dark','Theme works without storage');
console.log('PASS: system theme, saved preference, explicit override, invalid storage and denied storage.');
