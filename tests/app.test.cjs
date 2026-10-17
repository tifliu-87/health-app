const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const nodes=new Map(),store=new Map();
function el(s){if(!nodes.has(s))nodes.set(s,{value:'',style:{},setAttribute(){},showModal(){},close(){},innerHTML:''});return nodes.get(s);}
const ctx=vm.createContext({document:{querySelector:el},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},crypto:require('node:crypto').webcrypto,structuredClone,Date,console,setTimeout:()=>1,clearTimeout(){},navigator:{}});
vm.runInContext(fs.readFileSync('app.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
run("$('#content').onclick({target:{closest:()=>({dataset:{add:'eggs'}})}})");
assert.equal(run('data.entries.length'),1);assert.equal(run('data.entries[0].protein'),12);assert.match(el('#content').innerHTML,/108 g to reach/);
run("$('#workout-tab').onclick()");assert.match(el('#content').innerHTML,/Log set/);
run("mutate(d=>d.sets.push({id:'test',name:'Squat',date:chosenDate,reps:10,weight:25,unit:'lb'}))");assert.match(el('#content').innerHTML,/10 reps/);
run("chosenDate='2000-01-01';render()");assert.match(el('#content').innerHTML,/Your first set/);
run("validate(JSON.parse(localStorage.getItem(KEY)))");
assert.throws(()=>run("validate({version:1,goals:{protein:-1,calories:2},foods:[],entries:[],sets:[]})"));
run("$('#content').onclick({target:{closest:()=>({dataset:{removefood:data.entries[0].id}})}})");assert.equal(run('data.entries.length'),0);
console.log('PASS: food totals, persistence, tabs, workout history, date isolation, backup validation, undo');
