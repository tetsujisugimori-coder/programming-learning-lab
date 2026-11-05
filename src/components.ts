import type { Example, Lesson } from './curriculum';

export const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

export function codeCard(example: Example): string {
  const label = example.kind === 'command' ? 'PowerShellへ入力するコマンド' : '.pyファイルへ書くPythonコード';
  return `<div class="code-card ${example.error ? 'intentional-error' : ''}" data-example="${example.id}">
    <div class="code-label"><span>${escape(label)}</span><button type="button" class="copy" data-copy="${example.id}" aria-label="${escape(label)}をコピー">コピー</button></div>
    ${example.error ? '<p class="error-label">意図的なエラー例</p>' : ''}
    <pre tabindex="0" aria-label="${escape(label)}"><code>${escape(example.code)}</code></pre>
    <p class="copy-status" role="status" data-copy-status="${example.id}"></p>
    ${example.output ? `<details class="output"><summary>表示例を見る${example.error ? '（代表的なエラー文）' : ''}</summary><p>教材の表示例です。PCの実行結果ではありません。</p><pre tabindex="0"><samp>${escape(example.output)}</samp></pre></details>` : ''}
  </div>`;
}

export function lessonView(lesson: Lesson, index: number): string {
  const id = lesson.id;
  return `<article id="${id}" class="lesson" ${index > 0 ? 'hidden' : ''} aria-labelledby="${id}-title">
    <div class="lesson-heading"><span class="eyebrow">LESSON ${String(index + 1).padStart(2, '0')} / 08</span><h2 id="${id}-title" tabindex="-1">${escape(lesson.title)}</h2><p class="lead">${escape(lesson.lead)}</p></div>
    <div class="lesson-grid">
      <section class="explanation" id="${id}-explanation" aria-label="考え方と手順">
        <div class="column-heading"><span class="number">01</span><h3>読んで、考える</h3></div>
        ${lesson.blocks.map((block, n) => `<div class="text-block">
          ${block.heading ? `<h4>${escape(block.heading)}</h4>` : ''}
          ${block.text ? `<p>${escape(block.text)}</p>` : ''}
          ${block.list ? `<ul>${block.list.map(item => `<li>${escape(item)}</li>`).join('')}</ul>` : ''}
          ${block.command ? codeCard({ id: `${id}-command-${n}`, kind: 'command', code: block.command }) : ''}
          ${block.note ? `<aside class="note"><span class="note-label">メモ</span><p>${escape(block.note)}</p></aside>` : ''}
        </div>`).join('')}
        ${index === 1 ? '<figure class="flow"><figcaption>コードと実行の関係〈概念図〉</figcaption><ol><li><b>1. 書いて保存</b><span>VS Code / chapter01.py</span></li><li><b>2. Pythonが実行</b><span>拡張機能から本体を呼ぶ</span></li><li><b>3. 結果を読む</b><span>ターミナルに文字が出る</span></li></ol><p>実画面や実行成功の証拠ではありません。</p></figure>' : ''}
        <label class="record"><input type="checkbox" data-record="read" data-lesson="${id}"> この節を読了にする（自己記録）</label>
      </section>
      <div class="split-handle" role="separator" tabindex="0" aria-label="説明と課題の幅を調整" aria-controls="${id}-explanation" aria-orientation="vertical" aria-valuemin="35" aria-valuemax="65" aria-valuenow="50"><span aria-hidden="true">⋮</span></div>
      <section class="workbench" aria-label="例と練習">
        <div class="column-heading"><span class="number">02</span><h3>予想して、確かめる</h3>${lesson.pc ? '<span class="pc-badge">PCで実習</span>' : ''}</div>
        ${lesson.example ? codeCard(lesson.example) : '<div class="starter-note"><span aria-hidden="true">↗</span><p>うまくいく予想も、意外な結果も、学びの出発点です。今の考えを残しておきましょう。</p></div>'}
        <div class="exercise" id="${id}-prediction"><label for="${id}-notes"><span class="step-label">予想する・下書きする</span>${escape(lesson.prediction)}</label><textarea id="${id}-notes" rows="4" placeholder="いまの予想を、自分の言葉で…" aria-describedby="${id}-notes-help"></textarea><p class="small" id="${id}-notes-help">自由記述は自動採点しません。再読込まで、このページ内で保持します。</p></div>
        <div class="practice" id="${id}-practice"><h4>${lesson.pc ? 'PCで実習' : '少し変えて考える'}</h4><p>${escape(lesson.practice)}</p><p class="verify"><b>確認</b> ${escape(lesson.verify)}</p>
        ${lesson.pc ? `<label class="record"><input type="checkbox" data-record="pc" data-lesson="${id}"> PCで実行して確かめた（自己申告）</label><p class="small">サイトから実行成功は観測できません。</p>` : ''}</div>
        <div class="hints" aria-label="段階ヒント"><p class="step-label">困ったときは、少しずつ</p>
          ${lesson.hints.map((hint, n) => `<details data-hint="${n}" ${n > 0 ? 'hidden' : ''}><summary>${n < 2 ? `ヒント${n + 1}` : '解答例'}</summary><div class="hint-content"><p>${escape(hint)}</p>${n === 2 && lesson.solution ? codeCard(lesson.solution) : ''}</div></details>`).join('')}
        </div>
        <form class="quiz" id="${lesson.quiz.id}" data-lesson="${id}"><fieldset><legend><span class="step-label">理解チェック · 1問</span>${escape(lesson.quiz.question)}</legend>
        ${lesson.quiz.options.map((option, n) => `<label class="choice"><input type="radio" name="${lesson.quiz.id}" value="${n}"><span>${escape(option)}</span></label>`).join('')}
        </fieldset><button class="primary" type="submit">回答を確認する</button><p class="quiz-feedback" role="status"></p><p class="quiz-state small">未回答・未判定</p></form>
      </section>
    </div>
  </article>`;
}

export function setupSplitter(root: HTMLElement) {
  let ratio = 50;
  const handles = Array.from(root.querySelectorAll<HTMLElement>('.split-handle'));
  const apply = (value: number) => {
    ratio = Math.max(35, Math.min(65, value));
    root.style.setProperty('--split', `${ratio}fr`);
    root.style.setProperty('--other', `${100 - ratio}fr`);
    handles.forEach(handle => {
      handle.setAttribute('aria-valuenow', String(Math.round(ratio)));
      handle.setAttribute('aria-valuetext', `説明 ${Math.round(ratio)}%、課題 ${Math.round(100 - ratio)}%`);
    });
  };
  handles.forEach(handle => {
    let pointer: number | null = null;
    const end = () => {
      if (pointer !== null && handle.hasPointerCapture(pointer)) handle.releasePointerCapture(pointer);
      pointer = null;
    };
    handle.addEventListener('keydown', event => {
      if (event.isComposing) return;
      const next = event.key === 'Home' ? 35 : event.key === 'End' ? 65 : event.key === 'ArrowLeft' ? ratio - 5 : event.key === 'ArrowRight' ? ratio + 5 : null;
      if (next !== null) { event.preventDefault(); end(); apply(next); }
      if (event.key === 'Escape') end();
    });
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      pointer = event.pointerId;
      handle.setPointerCapture(pointer);
      handle.focus();
    });
    handle.addEventListener('pointermove', event => {
      if (event.pointerId !== pointer) return;
      const box = handle.parentElement!.getBoundingClientRect();
      apply((event.clientX - box.left) / box.width * 100);
    });
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
    handle.addEventListener('lostpointercapture', () => { pointer = null; });
    handle.addEventListener('dblclick', () => { end(); apply(50); });
    window.addEventListener('resize', end);
    document.addEventListener('visibilitychange', () => { if (document.hidden) end(); });
  });
  apply(50);
  return () => apply(50);
}
