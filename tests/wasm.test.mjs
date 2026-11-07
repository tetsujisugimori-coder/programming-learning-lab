import test from 'node:test';
import assert from 'node:assert/strict';
import wabtFactory from 'wabt';
import { sampleWat, wasmChapters, wasmLessons } from '../src/wasm-curriculum.ts';
const wabt = await wabtFactory();
function compile(code) { const m=wabt.parseWat('test.wat',code);try {m.validate();return m.toBinary({}).buffer;}finally{m.destroy();} }
async function run(code,a,b){const {instance}=await WebAssembly.instantiate(compile(code));return instance.exports.calculate(a,b);}
test('13 chapters, eight independent lessons and explicit quiz keys',()=>{assert.equal(wasmChapters.length,13);assert.equal(wasmLessons.length,8);for(const l of wasmLessons){assert.equal(l.hints.length,3);assert.ok(l.options[l.correct]);assert.ok(l.task&&l.explanation);}});
for(const [a,b,want] of [[2,3,5],[-7,2,-5],[0,0,0],[2147483647,1,-2147483648],[-2147483648,-1,2147483647]])test(`real Wasm add ${a},${b}`,async()=>assert.equal(await run(sampleWat,a,b),want));
test('real subtraction',async()=>assert.equal(await run(sampleWat.replace('i32.add','i32.sub'),7,2),5));
test('syntax invalid rejected',()=>assert.throws(()=>compile('(module')));
test('type mismatch rejected',()=>assert.throws(()=>compile(sampleWat.replace('i32.add','f32.add'))));
test('runtime trap distinct from compile success',async()=>assert.rejects(()=>run(sampleWat.replace('i32.add','unreachable'),2,3),WebAssembly.RuntimeError));
test('corrupt binary rejected by browser API',async()=>assert.rejects(()=>WebAssembly.compile(new Uint8Array([0,1,2])),WebAssembly.CompileError));
