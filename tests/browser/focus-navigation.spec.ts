import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { sampleWat } from '../../src/wasm-curriculum';

declare global {
  interface Window {
    focusAudit: unknown[];
    workerAudit: { created: number; terminated: number };
    preservedPython: Element | null;
  }
}
const output = process.env.FOCUS_EVIDENCE_DIR || 'docs/evidence/wasm-focus-20261109/after';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.focusAudit = [];
    window.workerAudit = { created: 0, terminated: 0 };
    const focus = HTMLElement.prototype.focus;
    HTMLElement.prototype.focus = function (options) {
      const before = { type: 'focus-call', at: performance.now(), hash: location.hash, target: this.id || this.outerHTML.slice(0,100), hiddenAncestor: this.closest('[hidden]')?.id ?? null, rendered: this.getClientRects().length > 0 };
      focus.call(this, options);
      window.focusAudit.push({ ...before, active: document.activeElement?.id || document.activeElement?.tagName });
    };
    const OriginalWorker = window.Worker;
    window.Worker = class extends OriginalWorker {
      constructor(url: string | URL, options?: WorkerOptions) { super(url, options); window.workerAudit.created++; }
      terminate() { window.workerAudit.terminated++; super.terminate(); }
    };
    window.addEventListener('hashchange', () => {
      window.focusAudit.push({ type: 'hashchange-start', hash: location.hash, at: performance.now() });
      setTimeout(() => window.focusAudit.push({ type: 'hashchange-end', hash: location.hash, at: performance.now(), active: document.activeElement?.id || document.activeElement?.tagName }), 0);
    });
  });
});
test.afterEach(async ({ page, browser }, info) => {
  mkdirSync(output, { recursive: true });
  const stem = `${info.project.name}-${info.title.replace(/[^a-zA-Z0-9]+/g,'-')}`;
  const observed = page ? await page.evaluate(() => ({ events: window.focusAudit, workers: window.workerAudit, hash: location.hash, active: document.activeElement?.id || document.activeElement?.tagName, hiddenFocus: !!document.activeElement?.closest('[hidden]') })).catch(() => null) : null;
  writeFileSync(`${output}/${stem}.json`, JSON.stringify({ project: info.project.name, title: info.title, status: info.status, browser: browser.version(), observed }, null, 2));
  if (page && !page.isClosed()) await page.screenshot({ path: `${output}/${stem}.png`, fullPage: true });
});
async function visibleFocus(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeVisible();
  await expect(page.locator(selector)).toBeFocused();
  expect(await page.evaluate(() => !!document.activeElement?.closest('[hidden]'))).toBe(false);
}
async function noHiddenFocusCalls(page: Page) {
  expect(await page.evaluate(() => window.focusAudit.filter(e => (e as {type?:string;rendered?:boolean}).type === 'focus-call' && !(e as {rendered?:boolean}).rendered))).toEqual([]);
}

test('focus return to Python lesson', async ({ page }) => {
  await page.goto('/#py-ch01-goals');
  await page.getByRole('link', { name:'WebAssembly 基本編', exact:true }).click();
  await visibleFocus(page, '[data-wasm-lesson="0"] h2');
  await page.getByRole('link', { name:'Pythonへ戻る' }).click();
  await visibleFocus(page, '#py-ch01-goals-title');
  await noHiddenFocusCalls(page);
});

test('focus return to Python chapters', async ({ page }) => {
  await page.goto('/#chapters');
  await page.getByRole('link', { name:'WebAssembly 基本編', exact:true }).click();
  await page.evaluate(() => { location.hash = '#chapters'; });
  await visibleFocus(page, '#chapters-title');
  await noHiddenFocusCalls(page);
});

test('focus repeated routes preserve DOM input and records', async ({ page }) => {
  await page.goto('/#py-ch01-goals');
  await page.evaluate(() => { window.preservedPython = document.querySelector('#py-ch01-goals'); });
  await page.locator('#py-ch01-goals textarea').fill('Python retained');
  await page.locator('#py-ch01-goals [data-record="read"]').check();
  await page.getByRole('link', { name:'WebAssembly 基本編', exact:true }).click();
  const s = page.locator('[data-wasm-lesson="0"]');
  await s.locator('.wasm-code summary').click();
  const changed = sampleWat.replace('i32.add','i32.sub');
  await s.locator('.wat-editor').fill(changed);
  await s.locator('[data-wasm-memo]').fill('Wasm retained');
  await s.locator('[data-wasm-read]').check();
  await page.locator('.wasm-nav a[href="#wasm-2"]').click();
  await visibleFocus(page, '[data-wasm-lesson="1"] h2');
  await page.getByRole('link', { name:'Pythonへ戻る' }).click();
  await visibleFocus(page, '#py-ch01-goals-title');
  await expect(page.locator('#py-ch01-goals textarea')).toHaveValue('Python retained');
  await expect(page.locator('#py-ch01-goals [data-record="read"]')).toBeChecked();
  expect(await page.evaluate(() => window.preservedPython === document.querySelector('#py-ch01-goals'))).toBe(true);
  await page.getByRole('link', { name:'WebAssembly 基本編', exact:true }).click();
  await visibleFocus(page, '[data-wasm-lesson="0"] h2');
  await expect(s.locator('.wat-editor')).toHaveValue(changed);
  await expect(s.locator('[data-wasm-memo]')).toHaveValue('Wasm retained');
  await expect(s.locator('[data-wasm-read]')).toBeChecked();
  await expect(s.locator('.wasm-observed')).toContainText('未確認');
  await page.goBack(); await visibleFocus(page, '#py-ch01-goals-title');
  await page.goForward(); await visibleFocus(page, '[data-wasm-lesson="0"] h2');
  await noHiddenFocusCalls(page);
});

test('focus navigation terminates real running Worker', async ({ page }) => {
  await page.goto('/#wasm-1');
  const s = page.locator('[data-wasm-lesson="0"]');
  await s.locator('.wasm-code summary').click();
  await s.locator('.wat-editor').fill('(module (func (export "calculate") (param i32 i32) (result i32) (loop $forever br $forever) i32.const 0))');
  await s.getByRole('button', {name:'実Wasmを実行',exact:true}).click();
  await expect(s.locator('[data-wasm-action="stop"]')).toBeEnabled();
  await page.getByRole('link',{name:'Pythonへ戻る'}).click();
  await visibleFocus(page, '#py-ch01-goals-title');
  expect(await page.evaluate(() => window.workerAudit)).toEqual({created:1,terminated:1});
  await page.getByRole('link',{name:'WebAssembly 基本編',exact:true}).click();
  await expect(s.locator('.wasm-status')).toContainText('画面移動');
  await expect(s.locator('.wasm-observed')).toContainText('未確認');
  await expect(s.locator('.wasm-result')).toHaveText('');
  await expect(s.locator('[data-wasm-action="stop"]')).toBeDisabled();
  await noHiddenFocusCalls(page);
});

async function tabTo(page: Page, selector: string) {
  for (let i = 0; i < 150; i++) {
    if (await page.locator(selector).evaluate(el => el === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Tab did not reach ${selector}`);
}
test('focus keyboard and skip links stay in visible course', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter'); await visibleFocus(page, '#main');
  // Start a fresh document to traverse the header using only Tab/Enter.
  await page.goto('/');
  await tabTo(page, '#app > .course-bar a[href="#wasm-1"]');
  await page.keyboard.press('Enter'); await visibleFocus(page, '[data-wasm-lesson="0"] h2');
  // Shift+Tab walks back to the skip link, no programmatic focus placement.
  for (let i=0; i<40 && !await page.locator('.skip').evaluate(el=>el===document.activeElement); i++) await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter'); await visibleFocus(page, '#wasm-main');
  for (let i=0; i<40 && !await page.getByRole('link',{name:'Pythonへ戻る'}).evaluate(el=>el===document.activeElement); i++) await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link',{name:'Pythonへ戻る'})).toBeFocused();
  await page.keyboard.press('Enter'); await visibleFocus(page, '#py-ch01-goals-title');
  await noHiddenFocusCalls(page);
});

test('focus history restores Python main skip destination', async ({ page }) => {
  await page.goto('/#py-ch01-goals');
  await page.locator('.skip').focus();
  await page.keyboard.press('Enter');
  await visibleFocus(page, '#main');
  await page.getByRole('link', {name:'WebAssembly 基本編',exact:true}).click();
  await visibleFocus(page, '[data-wasm-lesson="0"] h2');
  await page.goBack();
  await expect(page).toHaveURL(/#main$/);
  await expect(page.locator('#wasm-course')).toBeHidden();
  await visibleFocus(page, '#main');
  expect(await page.evaluate(() => !!document.activeElement?.closest('[hidden]'))).toBe(false);
  await page.locator('.skip').focus(); await page.keyboard.press('Enter');
  await visibleFocus(page, '#main');
  await noHiddenFocusCalls(page);
});
