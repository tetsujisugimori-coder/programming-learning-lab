import test from 'node:test';
import assert from 'node:assert/strict';
import {conceptualStack} from '../src/wasm-stack.ts';
import {sampleWat,wasmChapters} from '../src/wasm-curriculum.ts';
import {wasmStage2} from '../src/wasm-stage2.ts';
import wabtFactory from 'wabt';
const wabt=await wabtFactory();
test('chapter 2 has eight goals/tasks/quizzes/three hints, total chapters 13',()=>{assert.equal(wasmChapters.length,13);assert.equal(wasmStage2.length,8);for(const l of wasmStage2){assert.match(l.text,/目標/);assert.ok(l.task);assert.equal(l.hints.length,3);assert.ok(l.options[l.correct]);}});
for(const [op,a,b,result] of [['add',2,3,5],['sub',7,2,5],['sub',2,7,-5],['add',2147483647,1,-2147483648],['sub',-2147483648,1,2147483647],['add',0,0,0]])test(`${op} ${a},${b}: independent expected stack and actual Wasm`,async()=>{
 const code=sampleWat.replace('i32.add',`i32.${op}`),model=conceptualStack(code,a,b);
 assert.equal(model.supported,true);assert.deepEqual(model.steps.map(x=>x.before),[[],[a],[a,b]]);assert.deepEqual(model.steps.map(x=>x.after),[[a],[a,b],[result]]);assert.deepEqual(model.steps[2].popped,[b,a]);
 const m=wabt.parseWat('test.wat',code);try{m.validate();const {instance}=await WebAssembly.instantiate(m.toBinary({}).buffer);assert.equal(instance.exports.calculate(a,b),result);}finally{m.destroy();}
});
test('reversed get order is respected',()=>{const code=sampleWat.replace('local.get $a','local.get $z').replace('local.get $b','local.get $a').replace('local.get $z','local.get $b').replace('i32.add','i32.sub');assert.deepEqual(conceptualStack(code,7,2).steps[2].after,[-5]);});
for(const [name,code] of [['syntax','(module'],['type',sampleWat.replace('i32.add','f32.add')],['const',sampleWat.replace('local.get $a','i32.const 2')],['underflow',sampleWat.replace('local.get $a','')],['extra value',sampleWat.replace('i32.add','')],['extra module',sampleWat+' (module)'],['adjacent',sampleWat.replace('local.get $b\n    i32.add','local.get $bi32.add')],['comment',sampleWat.replace('i32.add',';; i32.add')],['other export',sampleWat.replace('calculate','other')]])test(`unsupported ${name} never returns stale/partial steps`,()=>{const r=conceptualStack(code,2,3);assert.equal(r.supported,false);assert.deepEqual(r.steps,[]);});
for(const value of [NaN,Infinity,1.5,2147483648,-2147483649])test(`invalid i32 ${value}`,()=>assert.equal(conceptualStack(sampleWat,value,2).supported,false));
for(const separator of ['\u00a0','\u000b','\u2028'])test(`reject non-WAT whitespace ${separator.codePointAt(0)}`,()=>{const code=sampleWat.replace('local.get $a',`local.get${separator}$a`);assert.equal(conceptualStack(code,2,3).supported,false);assert.throws(()=>wabt.parseWat('x',code));});
for(const separator of [' ','\t','\n','\r'])test(`accept WAT whitespace ${separator.codePointAt(0)}`,()=>assert.equal(conceptualStack(sampleWat.replace('local.get $a',`local.get${separator}$a`),2,3).supported,true));
test('finite model input and instruction budget',()=>{assert.equal(conceptualStack(sampleWat+' '.repeat(16000),2,3).supported,false);assert.equal(conceptualStack(sampleWat.replace('i32.add',('local.get $a\n').repeat(257)+'i32.add'),2,3).supported,false);});
