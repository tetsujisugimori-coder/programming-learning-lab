import { test, expect } from '@playwright/test';
import { sampleWat } from '../../src/wasm-curriculum';
test('Stage 2 learning cycle, conceptual model, real execution and protected state',async({page},info)=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#wasm-2-1');
 const s=page.locator('[data-wasm-lesson="8"]');await expect(s).toBeVisible();
 await s.locator('.wasm-code summary').click();const code=s.locator('.wat-editor');
 await s.locator('.wasm-prediction').fill('5');
 await s.locator('.stack-start').focus();await page.keyboard.press('Enter');
 await expect(s.locator('.stack-output')).toContainText('前 []');
 await s.locator('.stack-next').click();await expect(s.locator('.stack-output')).toContainText('後 [2,3]');
 await s.locator('.stack-select').selectOption('2');await expect(s.locator('.stack-output')).toContainText('取り出す順 [3,2] | 後 [5]');
 await s.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(s.locator('.wasm-result')).toHaveText('5');await expect(s.locator('.wasm-comparison')).toContainText('：一致');
 await s.locator('[data-wasm-memo]').fill('右operandを先に取り出す');await s.locator('[data-wasm-read]').check();
 await s.locator('.wasm-a').fill('7');await s.locator('.wasm-b').fill('2');await code.fill(sampleWat.replace('i32.add','i32.sub'));
 await expect(s.locator('.stack-output')).toContainText('未観察');await expect(s.locator('.wasm-result')).toBeEmpty();
 await s.locator('.stack-start').click();await s.locator('.stack-select').selectOption('2');await expect(s.locator('.stack-output')).toContainText('後 [5]');
 await s.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(s.locator('.wasm-result')).toHaveText('5');
 for(const bad of ['(module',sampleWat.replace('i32.add','f32.add')]){await code.fill(bad);await s.locator('.stack-start').click();await expect(s.locator('.stack-output')).toContainText('非対応');await expect(s.locator('.stack-select')).toBeDisabled();await s.getByRole('button',{name:'変換・検証',exact:true}).click();await expect(s.locator('.wasm-status')).toContainText('エラー');}
 await code.fill('(module (func (export "calculate") (param i32 i32) (result i32) (loop $forever br $forever) i32.const 0))');
 await s.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await s.getByRole('button',{name:'停止',exact:true}).click();await expect(s.locator('.wasm-status')).toContainText('停止');
 await s.getByRole('button',{name:'コードと実行欄を初期化'}).click();await expect(code).toBeFocused();await expect(code).toHaveValue(sampleWat);
 await s.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(s.locator('.wasm-result')).toHaveText('5');
 await s.locator('.stack-reset').click();await expect(s.locator('.stack-start')).toBeFocused();
 await page.getByRole('link',{name:'Pythonへ戻る'}).click();await expect(s).toBeHidden();
 await page.getByRole('link',{name:'WebAssembly 基本編',exact:true}).click();await expect(page.locator('[data-wasm-lesson="0"]')).toBeVisible();
 await page.locator('.wasm-nav a[href="#wasm-2-1"]').click();await expect(s.locator('[data-wasm-memo]')).toHaveValue('右operandを先に取り出す');await expect(s.locator('[data-wasm-read]')).toBeChecked();
 await expect(s.locator('h2')).toBeFocused();
 for(let i=2;i<=8;i++){await page.locator(`.wasm-nav a[href="#wasm-2-${i}"]`).click();await expect(page.locator(`[data-wasm-lesson="${i+7}"] h2`)).toBeFocused();}
 await page.locator('.wasm-nav a[href="#wasm-2-1"]').click();
 await page.evaluate(()=>document.documentElement.style.fontSize='32px');expect(await page.evaluate(()=>getComputedStyle(document.documentElement).fontSize)).toBe('32px');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);expect(errors).toEqual([]);
 await page.screenshot({path:`${process.env.E2E_EVIDENCE_ROOT || 'docs/evidence/wasm-stage2'}/stage2-${info.project.name}.png`,fullPage:true});
});
