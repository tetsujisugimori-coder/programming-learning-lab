import { chapters, languages, lessons, officialSources, type Example } from './curriculum';
import { escape, lessonView, setupSplitter } from './components';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
const records = new Map(lessons.map(lesson => [lesson.id, { read: false, pc: false, correct: false }]));
let current = 0;
let view: 'lesson' | 'chapters' = 'lesson';
const examples = new Map<string, string>();
const addExample = (example: Example) => examples.set(example.id, example.code);
lessons.forEach(lesson => {
  if (lesson.example) addExample(lesson.example);
  if (lesson.solution) addExample(lesson.solution);
  lesson.blocks.forEach((block, n) => { if (block.command) examples.set(`${lesson.id}-command-${n}`, block.command); });
});

app.innerHTML = `
  <header class="site-header"><a class="brand" href="#${lessons[0].id}" aria-label="プログラム学習 第1章の最初へ"><span class="brand-icon" aria-hidden="true">&gt;_</span><span>プログラム学習<small>PROGRAMMING LEARNING LAB</small></span></a><span class="header-tag">小さく試して、わかるを増やす。</span></header>
  <div class="course-bar"><nav aria-label="学習する言語">${languages.map((lang, n) => n === 0 ? `<span class="language active">${lang.name} <small>${lang.status}</small></span>` : `<span class="language upcoming">${lang.name} <small>${lang.status}</small></span>`).join('')}</nav><span class="session-tag">記録は再読込まで</span></div>
  <div class="shell">
    <aside class="sidebar" aria-label="教材ナビゲーション"><div class="course-label">PYTHON / 基本編</div><button id="show-chapters" class="all-chapters">全13章を見る <span aria-hidden="true">↗</span></button><div class="sidebar-rule"></div><p class="small">いま学んでいる章</p><strong class="sidebar-title">01 表示と実行</strong><nav aria-label="第1章の節"><ol class="lesson-nav">${lessons.map((lesson, n) => `<li><a href="#${lesson.id}" data-nav="${n}" ${n === 0 ? 'aria-current="step"' : ''}><span class="nav-number">${String(n + 1).padStart(2, '0')}</span><span>${escape(lesson.title)}<small data-nav-state="${lesson.id}">未読</small></span></a></li>`).join('')}</ol></nav><div class="sidebar-progress"><label for="read-progress">第1章の読了 <b id="read-count">0 / 8</b></label><progress id="read-progress" max="8" value="0"></progress><p id="other-counts">理解チェック正解 0 / 8<br>PC実行の自己申告 0 / 6</p><p class="small">3つの記録を区別します。章の自動完了判定はありません。</p></div></aside>
    <main id="main" tabindex="-1">
      <div class="breadcrumbs">Python基本編 <span aria-hidden="true">/</span> <span id="breadcrumb-current">第1章</span></div>
      <section class="chapter-intro" id="chapter-intro"><div><p class="eyebrow">CHAPTER 01 · はじめの一歩</p><h1>表示と実行<span class="subtitle">実行環境の準備から、最初の1行へ。</span></h1></div><div class="chapter-mark" aria-hidden="true">print<span>(</span><i>"Hello!"</i><span>)</span></div></section>
      <div id="lesson-tools" class="lesson-tools"><p><span class="dot" aria-hidden="true"></span>予想 → PCで実行 → 一部変更 → 確認</p><button id="reset-split" class="text-button">幅を初期化</button></div>
      <p class="split-help" id="split-help">PCでは境界をドラッグ、またはTabで境界に移動して左右矢印で幅を調整できます（35〜65%）。Home / Endで両端へ。</p>
      <div id="lessons">${lessons.map(lessonView).join('')}</div>
      <section id="chapter-list" hidden aria-labelledby="chapters-title"><p class="eyebrow">LEARNING PATH</p><h1 id="chapters-title" tabindex="-1">Python基本編の道のり</h1><p>まずは第1章から。第2章以降は到達目標を公開し、本文は準備中です。</p><div class="chapter-cards">${chapters.map((chapter, n) => `<article id="${chapter.id}" class="chapter-card ${chapter.ready ? 'available' : ''}"><span class="chapter-number">${String(n + 1).padStart(2, '0')}</span><div><span class="status-label">${chapter.ready ? '学習できます · 8節' : '準備中'}</span><h2>第${n + 1}章：${escape(chapter.title)}</h2><p>${escape(chapter.goal)}</p>${chapter.ready ? '<button class="primary" id="resume-lesson">第1章へ戻る</button>' : '<p class="small">教材本文はまだありません。</p>'}</div></article>`).join('')}</div></section>
      <nav class="lesson-footer" id="lesson-footer" aria-label="前後の節"><button id="previous" disabled>← 前の節</button><span id="lesson-position">1 / 8</span><button id="next" class="primary">次の節 →</button></nav>
      <section id="reflection" class="reflection" hidden><h2>ここまでの自分を振り返る</h2><p>指示と結果の関係を、自分の変更で確かめられましたか。読了やチェック正解は、PCでの実行成功を保証するものではありません。</p><p id="summary-counts"></p><button id="finish-path">これからの章を見る</button></section>
      <details class="sources"><summary>公式資料・この教材について</summary><p>操作名・導入案内の確認日：2026-11-05。利用者のPythonの版は指定しません。</p><ul>${officialSources.map(source => `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${escape(source.label)} ↗</a></li>`).join('')}</ul><p>UI設計の参照：Loading-museum / Intelligence UI Museum。独自再構成・コード転載なし。参照SHAと判断はリポジトリのdocs/provenance.mdに記録しています。</p><p><a href="https://github.com/tetsujisugimori-coder/programming-learning-lab">ソースと制作記録</a></p></details>
      <footer class="site-footer">プログラム学習 <span>予想が違っても、そこから始めよう。</span></footer>
    </main>
  </div>`;

const get = <T extends HTMLElement = HTMLElement>(selector: string) => app.querySelector<T>(selector)!;
const resetSplit = setupSplitter(app);
get('#reset-split').addEventListener('click', resetSplit);

function updateRecords() {
  const values = [...records.values()];
  const read = values.filter(value => value.read).length;
  const correct = values.filter(value => value.correct).length;
  const pc = values.filter(value => value.pc).length;
  get<HTMLProgressElement>('#read-progress').value = read;
  get('#read-count').textContent = `${read} / 8`;
  get('#other-counts').innerHTML = `理解チェック正解 ${correct} / 8<br>PC実行の自己申告 ${pc} / 6`;
  get('#summary-counts').textContent = `読了 ${read} / 8節 · 理解チェック正解 ${correct} / 8問 · PC実行の自己申告 ${pc} / 6節（未観測）`;
  for (const [id, record] of records) {
    get(`[data-nav-state="${id}"]`).textContent = [record.read ? '読了' : '未読', record.correct ? 'チェック正解' : '', record.pc ? 'PC自己申告' : ''].filter(Boolean).join(' · ');
  }
}

function showLesson(index: number, focus = true) {
  current = index;
  view = 'lesson';
  get('#chapter-list').hidden = true;
  for (const selector of ['#lessons', '#chapter-intro', '#lesson-tools', '#lesson-footer', '#split-help']) get(selector).hidden = false;
  lessons.forEach((lesson, n) => { get(`#${lesson.id}`).hidden = index !== n; });
  app.querySelectorAll<HTMLElement>('[data-nav]').forEach(link => {
    if (Number(link.dataset.nav) === index) link.setAttribute('aria-current', 'step');
    else link.removeAttribute('aria-current');
  });
  get<HTMLButtonElement>('#previous').disabled = index === 0;
  get('#next').textContent = index === 7 ? '章の振り返りへ ↓' : '次の節 →';
  get('#lesson-position').textContent = `${index + 1} / 8`;
  get('#breadcrumb-current').textContent = `第1章 / ${index + 1}. ${lessons[index].title}`;
  get('#reflection').hidden = true;
  if (focus) get(`#${lessons[index].id}-title`).focus();
}

function showChapters(focus = true) {
  view = 'chapters';
  for (const selector of ['#lessons', '#chapter-intro', '#lesson-tools', '#lesson-footer', '#split-help', '#reflection']) get(selector).hidden = true;
  get('#chapter-list').hidden = false;
  get('#breadcrumb-current').textContent = '全13章の一覧';
  app.querySelectorAll('[data-nav]').forEach(link => link.removeAttribute('aria-current'));
  if (focus) get('#chapters-title').focus();
}

function navigate(index: number) {
  const hash = `#${lessons[index].id}`;
  if (location.hash === hash) showLesson(index);
  else location.hash = hash;
}
get('#show-chapters').addEventListener('click', () => { if (location.hash === '#chapters') showChapters(); else location.hash = '#chapters'; });
get('#resume-lesson').addEventListener('click', () => navigate(current));
get('#finish-path').addEventListener('click', () => { location.hash = '#chapters'; });
get('#previous').addEventListener('click', () => navigate(Math.max(0, current - 1)));
get('#next').addEventListener('click', () => {
  if (view !== 'lesson') return;
  if (current < lessons.length - 1) navigate(current + 1);
  else { get('#reflection').hidden = false; get('#reflection').scrollIntoView({ block: 'start' }); }
});

app.querySelectorAll<HTMLInputElement>('[data-record]').forEach(input => input.addEventListener('change', () => {
  const record = records.get(input.dataset.lesson!)!;
  if (input.dataset.record === 'read') record.read = input.checked;
  else record.pc = input.checked;
  updateRecords();
}));

app.querySelectorAll<HTMLFormElement>('.quiz').forEach(form => {
  const lesson = lessons.find(item => item.id === form.dataset.lesson)!;
  const feedback = form.querySelector<HTMLElement>('.quiz-feedback')!;
  form.addEventListener('change', () => {
    records.get(lesson.id)!.correct = false;
    feedback.textContent = '';
    form.querySelector('.quiz-state')!.textContent = '選択中・未判定。「回答を確認する」で判定します。';
    updateRecords();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const value = new FormData(form).get(lesson.quiz.id);
    if (value === null) {
      feedback.textContent = '回答を1つ選んでください。まだ判定していません。';
      form.querySelector<HTMLInputElement>('input')!.focus();
      return;
    }
    const selected = Number(value);
    const correct = selected === lesson.quiz.correct;
    records.get(lesson.id)!.correct = correct;
    feedback.textContent = `${correct ? '✓ 正解' : '↻ もう一度考えよう'}：${lesson.quiz.reasons[selected]}${correct ? '' : ` 次のヒント：${lesson.quiz.hint}`}`;
    form.querySelector('.quiz-state')!.textContent = correct ? '理解チェック正解（PC実行の確認とは別）' : '再挑戦できます。選び直して回答を確認してください。';
    updateRecords();
  });
});

app.querySelectorAll<HTMLDetailsElement>('[data-hint]').forEach(details => details.addEventListener('toggle', () => {
  if (details.open && details.nextElementSibling instanceof HTMLDetailsElement) details.nextElementSibling.hidden = false;
}));

app.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const id = button.dataset.copy!;
  const status = get(`[data-copy-status="${id}"]`);
  button.disabled = true;
  button.textContent = 'コピー中…';
  status.textContent = 'クリップボードへコピーしています。';
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(examples.get(id)!);
    status.textContent = '✓ コピーしました。';
  } catch {
    status.textContent = 'コピーできませんでした。コード欄の文字を選んで手動でコピーしてください。';
  } finally {
    button.disabled = false;
    button.textContent = 'コピー';
  }
}));

updateRecords();

// One owner coordinates course visibility before either course moves focus.
// Python DOM/session state is kept intact by the additive Wasm module.
import { mountWasm } from './wasm-learning';
const routeWasm = mountWasm(app);
function route(focus = false) {
  if (routeWasm(focus)) return;
  // A history return may target main while Python was hidden. Restore first.
  if (location.hash === '#main') {
    if (focus) get('#main').focus();
    return;
  }
  if (location.hash === '#chapters') showChapters(focus);
  else {
    const index = lessons.findIndex(lesson => `#${lesson.id}` === location.hash);
    showLesson(index >= 0 ? index : current, focus);
  }
}
window.addEventListener('hashchange', () => route(true));
route();
