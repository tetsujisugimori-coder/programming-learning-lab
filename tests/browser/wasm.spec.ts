import { test, expect } from '@playwright/test';
import { sampleWat } from '../../src/wasm-curriculum';
test('Wasm real execution, failures, independent records and Python preservation', async ({ page }, info) => {
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  const pyMemo=page.locator('textarea').first();await pyMemo.fill('Python保持');
  await page.getByRole('link',{name:'WebAssembly 基本編',exact:true}).click();
  const section=page.locator('[data-wasm-lesson="0"]');
  await expect(section).toBeVisible();
  await expect(page).toHaveTitle('WebAssembly基本編 | プログラム学習');
  await page.locator('.skip').focus(); await page.keyboard.press('Enter'); await expect(page.locator('#wasm-main')).toBeFocused();
  await section.getByText('サンプルコードを開く・変更する',{exact:true}).click();
  const code=section.locator('.wat-editor'), status=section.locator('.wasm-status');
  await section.getByRole('button',{name:'変換・検証',exact:true}).click();await expect(status).toContainText('変換・検証成功');await expect(section.locator('.wasm-observed')).toContainText('未確認');
  await section.locator('.wasm-prediction').fill('5');await section.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(status).toHaveText('実Wasm実行成功');await expect(section.locator('.wasm-result')).toHaveText('5');await expect(section.locator('.wasm-comparison')).toHaveText('実行前の予想「5」：一致。変更点と理由を考えましょう。');
  await section.locator('.wasm-a').fill('2147483647');await expect(status).toHaveText('現在のコード・入力は未実行です。');await expect(section.locator('.wasm-call')).toHaveText('未実行：入力値を検証してから呼び出します');await section.locator('.wasm-b').fill('1');await expect(section.locator('.wasm-observed')).toContainText('未確認');await section.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(section.locator('.wasm-result')).toHaveText('-2147483648');
  for(const input of ['', '1.5','2147483648','abc']){await section.locator('.wasm-a').fill(input);await section.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(status).toContainText('入力エラー');}
  await section.locator('.wasm-a').fill('7');await section.locator('.wasm-b').fill('2');await code.fill(sampleWat.replace('i32.add','i32.sub'));await section.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(section.locator('.wasm-result')).toHaveText('5');
  for(const bad of ['(module',sampleWat.replace('i32.add','f32.add')]){await code.fill(bad);await section.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(status).toContainText('WAT変換・型検証エラー');}
  await code.fill(sampleWat.replace('i32.add','unreachable'));await section.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(status).toContainText('Wasm実行エラー');
  await code.fill('(module (import "env" "x" (func)))');await section.getByRole('button',{name:'変換・検証',exact:true}).click();await expect(status).toContainText('importを提供しません');
  await code.fill('(module (func (export "calculate") (param i32 i32) (result i32) (loop $forever br $forever) i32.const 0))');await section.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(status).toContainText('時間切れ',{timeout:8000});await expect(section.locator('.wasm-observed')).toContainText('未確認');
  await section.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await section.getByRole('button',{name:'停止',exact:true}).click();await expect(status).toContainText('利用者が停止');
  await section.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await page.locator('.wasm-nav a[href="#wasm-2"]').click();await page.locator('.wasm-nav a[href="#wasm-1"]').click();await expect(status).toContainText('画面移動');await expect(section.locator('.wasm-observed')).toContainText('未確認');
  await section.getByRole('button',{name:'コードと実行欄を初期化'}).click();await expect(code).toHaveValue(sampleWat);
  await section.locator('input[type=radio]').first().check();await expect(section.locator('.wasm-feedback')).toHaveText('選択中・未判定');await section.getByRole('button',{name:'回答を確認する'}).click();await expect(section.locator('.wasm-feedback')).toContainText('正解');
  await section.locator('[data-wasm-memo]').fill('実行と理解は別');await section.locator('[data-wasm-read]').check();await section.getByText('ヒント1',{exact:true}).click();await section.getByText('ヒント2',{exact:true}).click();
  await page.locator('.wasm-nav a[href="#wasm-2"]').click();await page.locator('.wasm-nav a[href="#wasm-1"]').click();await expect(section.locator('[data-wasm-memo]')).toHaveValue('実行と理解は別');await expect(section.getByText('解答の考え方',{exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Pythonへ戻る'}).click();await expect(pyMemo).toHaveValue('Python保持');
  await page.getByRole('link',{name:'WebAssembly 基本編',exact:true}).click();await expect(section.locator('[data-wasm-memo]')).toHaveValue('実行と理解は別');
  await section.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(status).toHaveText('実Wasm実行成功');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
  await page.screenshot({path:`docs/evidence/wasm-stage1/${info.project.name}.png`,fullPage:true});
  await page.locator('.wasm-nav a[href="#wasm-chapters"]').click();await expect(page.locator('#wasm-chapters .chapter-card')).toHaveCount(13);await expect(page.locator('#wasm-chapters')).toContainText('準備中');
});
test('unsupported platform and Worker load failure are not success',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(window,'WebAssembly',{value:undefined}));await page.goto('/#wasm-1');const s=page.locator('[data-wasm-lesson="0"]');await s.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(s.locator('.wasm-status')).toContainText('対応していません');await expect(s.locator('.wasm-observed')).toContainText('未確認');
});
test('worker load failure is visible',async({page})=>{
 await page.route('**/wasm-worker-*.js',route=>route.abort());await page.goto('/#wasm-1');const s=page.locator('[data-wasm-lesson="0"]');await s.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(s.locator('.wasm-status')).toContainText('Workerロード・実行失敗');await expect(s.locator('.wasm-observed')).toContainText('未確認');
});

test('nested static subpath loads compiler and executes real Wasm',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/nested/course/index.html#wasm-4');const s=page.locator('[data-wasm-lesson="3"]');await s.getByRole('button',{name:'実Wasmを実行',exact:true}).click();await expect(s.locator('.wasm-status')).toHaveText('実Wasm実行成功');await expect(s.locator('.wasm-result')).toHaveText('5');expect(errors).toEqual([]);
});
