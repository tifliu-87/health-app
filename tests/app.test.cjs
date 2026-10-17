const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const nodes=new Map(),store=new Map();
function el(s){if(!nodes.has(s))nodes.set(s,{value:'',style:{},setAttribute(){},showModal(){},close(){},innerHTML:''});return nodes.get(s);}
const ctx=vm.createContext({document:{querySelector:el},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},crypto:require('node:crypto').webcrypto,structuredClone,Date,console,setTimeout:()=>1,clearTimeout(){},navigator:{}});
vm.runInContext(fs.readFileSync('app.js','utf8'),ctx);
const run=s=>vm.runInContext(s,ctx);
run("$('#content').onclick({target:{closest:()=>({dataset:{add:'eggs'}})}})");
assert.equal(run('data.entries.length'),1);assert.equal(run('data.entries[0].protein'),12);assert.match(el('#content').innerHTML,/<strong>12<\/strong>/);
run("$('#workout-tab').onclick()");assert.match(el('#content').innerHTML,/Log set/);
run("mutate(d=>d.sets.push({id:'test',name:'Squat',date:chosenDate,reps:10,weight:25,unit:'lb'}))");assert.match(el('#content').innerHTML,/10 reps/);
run("chosenDate='2000-01-01';render()");assert.match(el('#content').innerHTML,/No sets logged/);
run("validate(JSON.parse(localStorage.getItem(KEY)))");
assert.throws(()=>run("validate({version:1,goals:{protein:-1,calories:2},foods:[],entries:[],sets:[]})"));
run("$('#content').onclick({target:{closest:()=>({dataset:{removefood:data.entries[0].id}})}})");assert.equal(run('data.entries.length'),0);
console.log('PASS: food totals, persistence, tabs, workout history, date isolation, backup validation, undo');

run("chosenDate=today();tab='nutrition';render()");
for(let i=0;i<2;i++)run("$('#content').onclick({target:{closest:()=>({dataset:{add:'eggs'}})}})");
assert.equal(run("data.entries.filter(e=>e.foodId==='eggs').length"),2);
run("$('#content').onclick({target:{closest:()=>({dataset:{subtract:'eggs'}})}})");
assert.equal(run('data.entries.length'),1);
run("chosenDate='2000-01-01';$('#content').onclick({target:{closest:()=>({dataset:{subtract:'eggs'}})}})");
assert.equal(run('data.entries.length'),1);
run("chosenDate=today();$('#content').onclick({target:{closest:()=>({dataset:{subtract:'eggs'}})}});$('#content').onclick({target:{closest:()=>({dataset:{subtract:'eggs'}})}})");
assert.equal(run('data.entries.length'),0);
run("data.entries.push({...data.foods[0],id:'legacy',date:chosenDate});render()");
assert.equal(run('matchesFood(data.entries[0],data.foods[0])'),true);
run("$('#content').onclick({target:{closest:()=>({dataset:{subtract:'eggs'}})}})");
assert.equal(run('data.entries.length'),0);
console.log('PASS: quantity increments, decrements, zero boundary, date isolation and legacy records');

const legacy=run('initial()');legacy.foods.push({id:'yogurt',name:'Greek yogurt'},{id:'chicken',name:'Chicken breast'});legacy.entries.push({id:'old-log',foodId:'chicken',protein:31});
ctx.legacy=legacy;run('trimPresets(legacy)');assert.equal(legacy.foods.length,2);assert.equal(legacy.entries.length,1);
legacy.foods.push({id:'custom',name:'Greek yogurt'});run('trimPresets(legacy)');assert.equal(legacy.foods.length,3);
ctx.FormData=class{constructor(form){this.form=form;}get(key){return this.form[key];}};
run("data.entries.push({...data.foods[0],id:'before-edit',date:chosenDate});foodForm('eggs')");
run("$('#foodform').onsubmit({preventDefault(){},target:{name:'Boiled eggs',serving:'1 egg',protein:'6',calories:'72'}})");
assert.equal(run('data.foods[0].name'),'Boiled eggs');assert.equal(run('data.foods[0].protein'),6);assert.equal(run('data.entries[0].protein'),12);assert.equal(run('data.entries[0].foodId'),'eggs');
console.log('PASS: preset removal preserves history; food edits save and preserve past nutrition');
