import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const css=readFileSync(new URL('../style.css',import.meta.url),'utf8');
const hex=value=>value.replace('#','').match(/../g).map(v=>parseInt(v,16));
const variable=name=>hex(css.match(new RegExp(`--${name}:(#[0-9a-f]{6})`))[1]);
const luminance=c=>c.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
const check=(label,a,b,min=4.5)=>assert.ok(ratio(a,b)>=min,`${label}: ${ratio(a,b).toFixed(2)} < ${min}`);
check('Body',variable('ink'),variable('paper'));
check('Dark sections',hex('#d6dfd3'),variable('forest'));
check('Gold buttons',variable('forest'),variable('gold'));
check('Light section labels',hex('#66531c'),variable('paper'));
// Bound the photo overlay against a pure white image, its brightest possible pixel.
const alpha=[...css.matchAll(/rgba\(8,24,18,([\d.]+)\)/g)].map(m=>Number(m[1]));
assert.ok(alpha.length>=4,'Desktop and mobile overlay definitions are present');
for(const opacity of alpha){
 const brightest=[8,24,18].map(v=>opacity*v+(1-opacity)*255);
 check('Photo body text',variable('paper'),brightest);
 check('Photo large gold heading',variable('gold'),brightest,3);
}
assert.match(css,/(?<![\w.-])\.three p\{color:inherit;/,'Shared cards must inherit their section color');
assert.doesNotMatch(css,/\.high-contrast/,'Readability must not depend on a contrast mode');
for(const file of ['index.html','en.html'])assert.doesNotMatch(readFileSync(new URL('../'+file,import.meta.url),'utf8'),/id="contrast"/);
console.log('PASS: default palette contrast, worst-case photo overlays, scoped card colors, no contrast-mode dependency.');

check('Dark body',hex('#f1eee3'),hex('#15221d'));
check('Dark surface',hex('#f1eee3'),hex('#20342b'));
check('Dark labels',hex('#e4c987'),hex('#15221d'));
console.log('PASS: dark theme text and surface contrast.');
