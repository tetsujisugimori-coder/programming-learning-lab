import { escape } from './components';
import { sampleWat, wasmChapters, wasmLessons as chapter1 } from './wasm-curriculum';

import { wasmStage2 } from './wasm-stage2';
import { conceptualStack } from './wasm-stack';
const wasmLessons = [...chapter1, ...wasmStage2];
const lessonUrl = (i: number) => i < 8 ? `#wasm-${i+1}` : `#wasm-2-${i-7}`;

export function mountWasm(app: HTMLElement) {
  const pythonTitle = document.title;
  const pythonNodes = Array.from(app.children) as HTMLElement[];
  const host = document.createElement('div');
  host.id = 'wasm-course'; host.hidden = true;
  host.innerHTML = `<header class="site-header"><a class="brand" href="#py-ch01-goals">プログラム学習</a><a href="#py-ch01-goals">Pythonへ戻る</a></header>
    <div class="course-bar"><nav aria-label="学習する言語"><a class="language" href="#py-ch01-goals">Python</a><a class="language active" href="#wasm-1">WebAssembly 基本編</a></nav><span>記録は再読込まで</span></div>
    <main class="wasm-main" id="wasm-main" tabindex="-1"><p class="eyebrow">WEBASSEMBLY / CHAPTER 01–02</p><h1>WebAssembly基本編：第1・2章</h1><p>考える → 予想する → 操作する → 実行する → 結果を確かめる → 修正する</p>
    <nav class="wasm-nav" aria-label="WebAssembly第1・2章の節">${wasmLessons.map((l,i)=>`<a href="${lessonUrl(i)}">${i<8?1:2}章 ${i%8+1}. ${escape(l.title)}</a>`).join('')}<a href="#wasm-chapters">全13章</a></nav>
    <p id="wasm-progress" role="status"></p>
    <section id="wasm-chapters" hidden><h2 tabindex="-1">基本編の道のり</h2><p>第1・2章が学習できます。応用編は構想段階です。</p><div class="chapter-cards">${wasmChapters.map(([title,goal],i)=>`<article class="chapter-card"><div><h3>${i+1}. ${escape(title)}</h3><p>${escape(goal)}</p>${i<2?`<a href="${i===0?'#wasm-1':'#wasm-2-1'}">第${i+1}章へ</a>`:'<span>準備中</span>'}</div></article>`).join('')}</div></section>
    ${wasmLessons.map((l,i)=>`<section data-wasm-lesson="${i}" hidden><h2 tabindex="-1">${i<8?1:2}章 ${i%8+1}. ${escape(l.title)}</h2><div class="wasm-grid"><article><p>${escape(l.text)}</p><h3>考えて、確かめる</h3><p>${escape(l.task)}</p><figure class="wasm-concept"><figcaption>教材用概念図（実命令トレースではありません）</figcaption><p>WAT → WABT → .wasm → WebAssembly API → 関数 → 結果</p><p>local.get a: [a] → local.get b: [a,b] → i32.add: [a+b]</p></figure><label><input type="checkbox" data-wasm-read> 読了（自己記録）</label><form class="wasm-quiz"><fieldset><legend>${escape(l.question)}</legend>${l.options.map((o,j)=>`<label><input type="radio" name="answer-${i}" value="${j}">${escape(o)}</label>`).join('')}</fieldset><button>回答を確認する</button><p role="status" class="wasm-feedback">未判定</p></form><label>自由記述メモ<textarea data-wasm-memo placeholder="予想と違った理由、変更点、次に試すこと"></textarea></label><div class="wasm-hints">${l.hints.map((h,j)=>`<details ${j?'hidden':''}><summary>${j===2?'解答の考え方':`ヒント${j+1}`}</summary><p>${escape(h)}</p></details>`).join('')}</div></article><div class="wasm-lab">
    <h3>実Wasmラボ</h3><p>同梱WABTで変換し、専用Workerで実行。外部サーバーへコードを送りません。</p><details class="wasm-code"><summary>サンプルコードを開く・変更する</summary><label>WATコード<textarea class="wat-editor" spellcheck="false" aria-label="WATコード">${escape(sampleWat)}</textarea></label></details>
    ${i>=8?`<section class="stack-model" aria-label="教材用スタック"><h4>予想 → 概念観察 → 実行 → 比較 → 説明</h4><p>限定文法の教材用モデル。左が底・右が頂上。実Wasmの命令トレースではありません。</p><button type="button" class="stack-start">現在のコードで概念図を作る</button><label>観察する命令<select class="stack-select" disabled><option>未観察</option></select></label><button type="button" class="stack-prev" disabled>前の命令</button><button type="button" class="stack-next" disabled>次の命令</button><button type="button" class="stack-reset">概念観察をリセット</button><p class="stack-output" role="status">未観察</p></section>`:""}<div class="wasm-inputs"><label>入力 a<input class="wasm-a" inputmode="numeric" value="2"></label><label>入力 b<input class="wasm-b" inputmode="numeric" value="3"></label></div>
    <label>実行前の予想<input class="wasm-prediction" placeholder="例：5"></label><div class="wasm-buttons"><button type="button" data-wasm-action="compile">変換・検証</button><button type="button" data-wasm-action="run" class="primary">実Wasmを実行</button><button type="button" data-wasm-action="stop" disabled>停止</button><button type="button" data-wasm-action="reset">コードと実行欄を初期化</button></div>
    <p class="wasm-status" role="status" aria-live="polite">未実行</p><p class="wasm-observed">現在のコード・入力：実行未確認</p><output class="wasm-result" aria-label="実Wasmの結果"></output><p class="wasm-comparison"></p><pre class="wasm-call">instance.exports.calculate(2, 3)</pre><details><summary>変換されたWasm（16進バイト列）</summary><pre class="wasm-bytes">未変換</pre></details><p class="small">整数入力は−2147483648〜2147483647。i32演算は32ビットで折り返します。実行は5秒で停止し、移動・停止でもWorkerを破棄します。権限はホストとimportに依存し、完全な安全保証ではありません。巨大なメモリ要求などの資源制限はブラウザーにも依存します。</p></div></div>
    <nav class="wasm-buttons" aria-label="前後の節">${i%8?`<a href="${lessonUrl(i-1)}">← 前の節</a>`:''}<a href="${i%8<7?lessonUrl(i+1):'#wasm-chapters'}">${i%8<7?'次の節 →':'章一覧と振り返り →'}</a></nav></section>`).join('')}
    <details class="sources"><summary>公式資料・制約・確認日</summary><p>2026-11-08 JST。WABT 1.0.39（Apache-2.0）を同梱。ブラウザー標準APIを使用。任意のimportは提供しません。ブラウザーとWorkerが必要です。読み込み後の変換・実行はネットワーク不要ですが、オフライン再起動のキャッシュ機能は未実装です。</p><ul><li><a href="https://webassembly.org/">WebAssembly公式</a></li><li><a href="https://developer.mozilla.org/en-US/docs/WebAssembly">MDN WebAssembly</a></li><li><a href="https://github.com/WebAssembly/wabt">WABT</a></li></ul><p>UIは独自実装。Pythonの既存分割表示を変更せず、本編は説明とラボの2列・狭幅では縦表示です。Wasmの可変分割と段階アニメーションは後続候補です。</p></details></main>`;
  app.append(host);
  const courseNav = app.querySelector('.course-bar nav')!;
  const entry = document.createElement('a'); entry.href='#wasm-1'; entry.className='language'; entry.textContent='WebAssembly 基本編'; courseNav.append(entry);
  const sections = Array.from(host.querySelectorAll<HTMLElement>('[data-wasm-lesson]'));
  const state = wasmLessons.map(()=>({read:false, correct:false, observed:false}));
  let active: { worker: Worker; timer: ReturnType<typeof setTimeout>; section: HTMLElement } | undefined;
  const el = <T extends HTMLElement = HTMLElement>(section: HTMLElement, selector: string) => section.querySelector<T>(selector)!;
  function progress() { el(host,'#wasm-progress').textContent=`読了 ${state.filter(s=>s.read).length}/16 · 理解チェック正解 ${state.filter(s=>s.correct).length}/16 · 現在のコード・入力の実行確認 ${state.filter(s=>s.observed).length}/16（独立した記録・自動完了なし）`; }
  function end() { if(!active) return; active.worker.terminate(); clearTimeout(active.timer); el<HTMLButtonElement>(active.section,'[data-wasm-action="stop"]').disabled=true; active=undefined; }
  function stop(reason:string) { if(active) { el(active.section,'.wasm-status').textContent=reason; end(); } }
  function invalidate(section:HTMLElement,index:number, resetModel=true) { stop('変更したため停止。成功には数えません。'); state[index].observed=false; el(section,'.wasm-status').textContent='現在のコード・入力は未実行です。'; el(section,'.wasm-call').textContent='未実行：入力値を検証してから呼び出します'; el(section,'.wasm-observed').textContent='現在のコード・入力：実行未確認'; el(section,'.wasm-result').textContent=''; el(section,'.wasm-comparison').textContent=''; el(section,'.wasm-bytes').textContent='未変換'; if(resetModel)resetConcept(section); progress(); }
  function resetConcept(section: HTMLElement) {
    const select = section.querySelector<HTMLSelectElement>('.stack-select');
    if (!select) return;
    select.innerHTML='<option>未観察</option>';select.disabled=true;
    el(section,'.stack-output').textContent='未観察：現在のコード・入力から作り直してください';
    for(const cls of ['.stack-prev','.stack-next']) el<HTMLButtonElement>(section,cls).disabled=true;
  }
  sections.forEach((section,i)=>{
    if(i>=8) {
      let steps: ReturnType<typeof conceptualStack>['steps'] = [];
      const select=el<HTMLSelectElement>(section,'.stack-select');
      const render=()=>{if(select.disabled)return;const n=Number(select.value),step=steps[n];if(!step)return;
        el(section,'.stack-output').textContent=`命令 ${n+1}: ${step.instruction} | 前 [${step.before}] | 取り出す順 [${step.popped}] | 後 [${step.after}]（教材モデル・実測ではない）`;
        el<HTMLButtonElement>(section,'.stack-prev').disabled=n===0;
        el<HTMLButtonElement>(section,'.stack-next').disabled=n===steps.length-1;
      };
      el(section,'.stack-start').addEventListener('click',()=>{
        const a=el<HTMLInputElement>(section,'.wasm-a').value.trim(),b=el<HTMLInputElement>(section,'.wasm-b').value.trim();
        const model=conceptualStack(el<HTMLTextAreaElement>(section,'.wat-editor').value,/^-?\d+$/.test(a)?Number(a):NaN,/^-?\d+$/.test(b)?Number(b):NaN);
        resetConcept(section);steps=model.steps;
        if(!model.supported){el(section,'.stack-output').textContent=`可視化非対応：${model.reason}`;return;}
        select.innerHTML=steps.map((step,n)=>`<option value="${n}">${n+1}. ${escape(step.instruction)}</option>`).join('');select.disabled=false;render();
      });
      select.addEventListener('change',render);
      for(const [cls,delta] of [['.stack-prev',-1],['.stack-next',1]] as const)el(section,cls).addEventListener('click',()=>{select.value=String(Number(select.value)+delta);render();});
      el(section,'.stack-reset').addEventListener('click',()=>{steps=[];resetConcept(section);el(section,'.stack-start').focus();});
    }
    el(section,'[data-wasm-read]').addEventListener('change',e=>{state[i].read=(e.target as HTMLInputElement).checked;progress();});
    const form=el<HTMLFormElement>(section,'.wasm-quiz');
    form.addEventListener('change',()=>{state[i].correct=false;el(section,'.wasm-feedback').textContent='選択中・未判定';progress();});
    form.addEventListener('submit',e=>{e.preventDefault(); const answer=new FormData(form).get(`answer-${i}`); state[i].correct=answer!==null&&Number(answer)===wasmLessons[i].correct; el(section,'.wasm-feedback').textContent=answer===null?'回答を選んでください':`${state[i].correct?'正解':'もう一度考えよう'}：${wasmLessons[i].explanation}`;progress();});
    section.querySelectorAll<HTMLDetailsElement>('.wasm-hints details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open&&d.nextElementSibling instanceof HTMLDetailsElement)d.nextElementSibling.hidden=false;}));
    for(const selector of ['.wat-editor','.wasm-a','.wasm-b'])el(section,selector).addEventListener('input',()=>invalidate(section,i));
    section.querySelectorAll<HTMLButtonElement>('[data-wasm-action]').forEach(button=>button.addEventListener('click',()=>{
      const action=button.dataset.wasmAction!;
      if(action==='stop'){stop('利用者が停止しました。成功には数えません。');return;}
      if(action==='reset'){invalidate(section,i);el<HTMLTextAreaElement>(section,'.wat-editor').value=sampleWat;el<HTMLInputElement>(section,'.wasm-a').value='2';el<HTMLInputElement>(section,'.wasm-b').value='3';el<HTMLInputElement>(section,'.wasm-prediction').value='';el(section,'.wasm-call').textContent='instance.exports.calculate(2, 3)';el(section,'.wasm-status').textContent='初期化しました。未実行';el<HTMLDetailsElement>(section,'.wasm-code').open=true;el(section,'.wat-editor').focus();return;}
      invalidate(section,i,false);
      const aText=el<HTMLInputElement>(section,'.wasm-a').value.trim(),bText=el<HTMLInputElement>(section,'.wasm-b').value.trim();
      const a=Number(aText),b=Number(bText);
      const valid=(s:string,n:number)=>/^-?\d+$/.test(s)&&Number.isInteger(n)&&n>=-2147483648&&n<=2147483647;
      if(action==='run'&&(!valid(aText,a)||!valid(bText,b))){el(section,'.wasm-status').textContent='入力エラー：符号付きi32の整数を入力してください。';return;}
      if(typeof WebAssembly==='undefined'||typeof Worker==='undefined'){el(section,'.wasm-status').textContent='このブラウザーはWebAssemblyまたはWorkerに対応していません。';return;}
      const code=el<HTMLTextAreaElement>(section,'.wat-editor').value;
      if(code.length>16000){el(section,'.wasm-status').textContent='入力エラー：WATは16000文字までです。';return;}
      const prediction=el<HTMLInputElement>(section,'.wasm-prediction').value.trim();
      let worker:Worker;
      try {worker=new Worker(new URL('./wasm-worker.ts',import.meta.url),{type:'module'});}catch(error){el(section,'.wasm-status').textContent=`Workerロード失敗：${String(error)}`;return;}
      const timer=setTimeout(()=>stop('時間切れ：5秒で停止しました。成功には数えません。'),5000);
      active={worker,timer,section};el<HTMLButtonElement>(section,'[data-wasm-action="stop"]').disabled=false;el(section,'.wasm-status').textContent='変換・検証中…';
      worker.onerror=event=>{if(active?.worker!==worker)return;el(section,'.wasm-status').textContent=`Workerロード・実行失敗：${event.message}`;end();};
      worker.onmessage=event=>{
        if(active?.worker!==worker)return;
        const data=event.data;end();
        if(!data.ok){el(section,'.wasm-status').textContent=`${data.phase}エラー：${data.error}`;return;}
        el(section,'.wasm-bytes').textContent=`${data.size} bytes\n${data.hex}`;
        if(data.mode==='compile'){el(section,'.wasm-status').textContent='変換・検証成功（計算は未実行）';return;}
        state[i].observed=true;el(section,'.wasm-observed').textContent='現在のコード・入力：実Wasmの正常終了を確認';el(section,'.wasm-status').textContent='実Wasm実行成功';el(section,'.wasm-result').textContent=String(data.result);el(section,'.wasm-call').textContent=`instance.exports.calculate(${a}, ${b})`;
        el(section,'.wasm-comparison').textContent=prediction===''?'予想は未記入です。結果の理由をメモしましょう。':`実行前の予想「${prediction}」：${Number(prediction)===data.result?'一致':'不一致'}。変更点と理由を考えましょう。`;progress();
      };
      worker.postMessage({code,a,b,mode:action});
    }));
  });
  const route=(focus=false)=>{
    stop('画面移動により停止しました。成功には数えません。');
    const match=location.hash.match(/^#wasm-(2-[1-8]|[1-8]|chapters)$/);
    const wasm=!!match;document.title=wasm?'WebAssembly基本編 | プログラム学習':pythonTitle;pythonNodes.forEach(n=>n.hidden=wasm);host.hidden=!wasm;
    if(!wasm)return false;
    const index=match[1]==='chapters'?-1:match[1].startsWith('2-')?7+Number(match[1].slice(2)):Number(match[1])-1;
    el(host,'#wasm-chapters').hidden=index!==-1;sections.forEach((s,i)=>s.hidden=i!==index);
    host.querySelectorAll('.wasm-nav a').forEach(a=>{if(a.getAttribute('href')===location.hash)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(focus)(index<0?el(host,'#wasm-chapters h2'):el(sections[index],'h2')).focus();
    return true;
  };
  window.addEventListener('pagehide',()=>stop('ページ終了により停止'));
  document.querySelector<HTMLAnchorElement>('a[href="#main"]')?.addEventListener('click', event => { if(!host.hidden){event.preventDefault();el(host,'#wasm-main').focus();} });
  progress();
  // The caller owns hashchange and invokes this before Python navigation.
  return route;
}
