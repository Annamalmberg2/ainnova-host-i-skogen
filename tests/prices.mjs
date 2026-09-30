import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
class Element {
 constructor(tag='div'){this.tag=tag;this.children=[];this.listeners={};this.value='';this.textContent='';this.attributes={};}
 append(...items){this.children.push(...items);}
 replaceChildren(...items){this.children=items;if(this.tag==='select')this.value=items[0]?.value||'';}
 add(item){this.children.push(item);}
 get options(){return this.children;}
 setAttribute(k,v){this.attributes[k]=v;}
 addEventListener(k,fn){this.listeners[k]=fn;}
}
const source=readFileSync(new URL('../prices.js',import.meta.url),'utf8');
const data={categories:[{name:'Unrelated',services:[{tjanst:'Excluded',pris:'1'}]},{name:'Alltid',services:[{tjanst:'<img onerror=alert(1)>',pris:'0 kr',beskrivning:'<script>bad</script>',lank:'javascript:alert(1)'},{tjanst:'Safe',pris:'100 kr',lank:'https://ainnova.se/kontakt'}]}]};
async function scenario({fail=false,cached=null,storageThrows=false,feed=data}={}){
 const elements=Object.fromEntries(['prices-status','price-results','price-category','price-refresh','prislista','adventure-price-status','hero-price','booking-price'].map(id=>[id,new Element(id==='price-category'?'select':'div')]));
 const controls=new Element();let stored;const jobs=[];
 const context={URL,Date,Intl,AbortController,Option:class extends Element{constructor(label,value){super('option');this.textContent=label;this.value=value;}},document:{documentElement:{lang:'sv'},getElementById:id=>elements[id],querySelector:()=>controls,querySelectorAll:()=>[elements['hero-price'],elements['booking-price']],createElement:tag=>new Element(tag)},window:{},localStorage:{getItem:()=>{if(storageThrows)throw Error();return cached?JSON.stringify(cached):null;},setItem:(k,v)=>{if(storageThrows)throw Error();stored=JSON.parse(v);}},setTimeout:()=>1,clearTimeout:()=>{},fetch:async()=>{if(fail)throw Error('offline');return {ok:true,json:async()=>feed};}};
 vm.runInNewContext(source,context);await new Promise(r=>setImmediate(r));return {elements,stored};
}
let run=await scenario();const tree=run.elements['price-results'];assert.equal(tree.children.length,2,'All published categories are included');const cards=tree.children[1].children[1].children;assert.equal(cards.length,2);assert.equal(cards[0].children[0].textContent,'<img onerror=alert(1)>');assert.equal(cards[0].children[0].children.length,0,'Unsafe URL is not linked');assert.equal(cards[1].children[0].children[0].href,'https://ainnova.se/kontakt');assert.equal(run.stored.categories.length,2);
run=await scenario({fail:true,cached:run.stored});assert.match(run.elements['prices-status'].textContent,/sparad prislista/);assert.equal(run.elements['price-results'].children.length,2);
run=await scenario({fail:true});assert.match(run.elements['prices-status'].textContent,/inte att hämta/);assert.equal(run.elements['price-refresh'].disabled,false);
run=await scenario({storageThrows:true});assert.equal(run.elements['price-results'].children.length,2,'Storage restrictions must not block live data');
console.log('PASS: complete price catalogue, text-only rendering, unsafe link rejection, saved fallback, empty failure and restricted storage.');

const adventure={categories:[{name:'Rådgivning & Utbildning',services:[{tjanst:'Äventyret',pris:'4 500 kr',beskrivning:'Test'}]}]};
run=await scenario({feed:adventure});
assert.equal(run.elements['hero-price'].textContent,'4 500 kr');
assert.equal(run.elements['booking-price'].textContent,'4 500 kr');
assert.match(run.elements['adventure-price-status'].textContent,/Fyra timmar/);
run=await scenario({fail:true,cached:run.stored});
assert.equal(run.elements['booking-price'].textContent,'4 500 kr');
assert.match(run.elements['adventure-price-status'].textContent,/Sparat pris/);
run=await scenario();assert.match(run.elements['adventure-price-status'].textContent,/kunde inte hittas/);
console.log('PASS: shared adventure price updates both placements, cached prices labelled, missing offer handled.');

run=await scenario();
run.elements['price-category'].value='Alltid';run.elements['price-category'].listeners.change();
assert.equal(run.elements['price-results'].children.length,1,'Filter selects one category');
run.elements['price-category'].value='all';run.elements['price-category'].listeners.change();
assert.equal(run.elements['price-results'].children.length,2,'All categories can be restored');
console.log('PASS: full catalogue and category filtering.');
