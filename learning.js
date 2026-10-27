/* Local-only learning evidence. No names, network requests or identifiers. */
(function(root){
'use strict';
var KEY='romi.learning.v1';
var SKILLS=[
 ['math-count','ספירה עד 10'],['math-add','חיבור עם תמונות עד 10'],
 ['math-add20','חיבור עד 20'],['math-subtract','חיסור עד 18'],['math-missing','מציאת מספר חסר'],
 ['logic-3','סדר ורמזים: 3 ילדים'],['logic-4','סדר ורמזים: 4 ילדים'],
 ['clock-1','שעות שלמות'],['clock-2','שעות וחצי'],['clock-3','רבעי שעה'],
 ['read-1','אות פותחת'],['read-2','התאמת מילה לתמונה'],['read-3','התאמת תמונה למילה']
];
function empty(){return {version:1,stars:0,skills:{},levels:{clock:1,logic:1,math:1,read:1}};}
function clean(raw){
 var out=empty();
 if(!raw||raw.version!==1)return out;
 if(Number.isSafeInteger(raw.stars)&&raw.stars>=0)out.stars=raw.stars;
 Object.keys(out.levels).forEach(function(k){var n=raw.levels&&raw.levels[k];if(Number.isInteger(n)&&n>=1&&n<=(k==='logic'?2:3))out.levels[k]=n;});
 SKILLS.forEach(function(s){var v=raw.skills&&raw.skills[s[0]];if(!v)return;var recent=Array.isArray(v.recent)?v.recent.filter(function(x){return typeof x==='boolean';}).slice(-5):[];out.skills[s[0]]={completed:Number.isSafeInteger(v.completed)&&v.completed>=0?v.completed:0,recent:recent};});
 return out;
}
function load(store){try{return clean(JSON.parse(store.getItem(KEY)));}catch(e){return empty();}}
function save(store,data){try{store.setItem(KEY,JSON.stringify(data));return true;}catch(e){return false;}}
function record(data,id,independent){if(!SKILLS.some(function(s){return s[0]===id;}))return;var v=data.skills[id]||(data.skills[id]={completed:0,recent:[]});v.completed++;v.recent.push(!!independent);v.recent=v.recent.slice(-5);}
function status(v){if(!v||!v.completed)return 'עדיין לא נוסה';if(v.recent.length>=5&&v.recent.filter(Boolean).length>=4)return 'הצלחות עצמאיות חוזרות';return 'ממשיכים לתרגל';}
var api={KEY:KEY,SKILLS:SKILLS,empty:empty,clean:clean,load:load,save:save,record:record,status:status};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RomiLearning=api;
})(typeof globalThis!=='undefined'?globalThis:this);
