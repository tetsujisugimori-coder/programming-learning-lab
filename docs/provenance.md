# UI採用記録

確認日：2026-11-05 JST。参照元は別リポジトリ。いずれもmainの取得時点を固定し、参照専用コピー（Git管理外 `.reference/`）でソースを読んだ。元のリポジトリは変更していない。

## 固定版と利用判断

- [Loading-museum](https://github.com/tetsujisugimori-coder/Loading-museum/tree/8f065e0d0392b78b927d148648d0b77205ef979a)：`8f065e0d0392b78b927d148648d0b77205ef979a`
- [intelligence-ui-museum](https://github.com/tetsujisugimori-coder/intelligence-ui-museum/tree/aa744be94e0e03efb31439f339361ccc859ad656)：`aa744be94e0e03efb31439f339361ccc859ad656`

両固定treeのルートにLICENSE/COPYINGおよび包括的な再利用許諾を確認できなかった。Intelligenceのv10内にはOpenAIおよびreact-remove-scroll-bar用の個別LICENSEがあるが、ミュージアム全体の許諾とは扱わない。したがって**ソース・CSS・画像・依存パッケージは転載／移植／抽出しない**。操作上の考え方を参考に、Web標準APIで独自再構成した。公式SDKや汎用ライブラリを導入したという表示もしない。再利用許諾を推定せず、この来歴を残す。

|候補・参照ソース（上記SHAに固定）|採用箇所と変更|採用理由|
|---|---|---|
|Loading `app/components/practical/Phase4BAsync.tsx` / `ResizableSplitPane`|`src/components.ts` / `setupSplitter`。Pointer Capture、separator、矢印/Home/End、解除・初期化の考え方を独自実装。範囲を35〜65%、狭幅はドラッグなし縦配置へ変更。表示・操作の状態はアニメーション完了に依存しない|説明と例を見比べ、必要な幅を学習者が選べる|
|Loading `app/components/practical/Phase4BInteractions.tsx` / `FormWizard`|`src/main.ts` の節移動と見出しfocus。全8節のDOMを一度構築してhiddenで保持。送信・段階の強制通過は設けない|往復時に予想・選択・開いたヒントを失わない|
|Loading `app/components/practical/Phase4Navigation.tsx` / `AnimatedAccordion`|`src/components.ts` の段階ヒント。native detailsを使用し、ヒント1→2→解答例を順に開放。高さ測定・WAAPIは省略。軽い出現のみCSS、低減時は無効|答えを先に見せず、必要な助けを段階的に出す|
|同ファイル / `SlidingTabs`|候補を検討。教材本文をタブに隠すと説明と課題の比較が難しくなるため、節リンク（aria-current）と章一覧に再構成。スライド帯は不採用|現在地・前後移動を明確にし、スマホでも内容を一列で読める|
|Loading `app/components/practical/Phase4Notices.tsx` / `ToastStack`、`Phase4Inputs.tsx` / `InlineValidation`|コピー通知を各コードに残るrole=statusへ。入力はtextareaにし、自動採点・IMEのEnter捕捉なし。通知を自動消去しない|成功・失敗を読み直せる。入力変換で学習を進めない|
|Loading `app/components/practical/PracticalB.tsx` / `state-button`|コピー待ちのdisabled・処理中表示→Promiseの成功／失敗で通知。参照元の模擬結果選択・時計を使わず、実際のClipboard APIへ接続|コピー処理の実結果を正直に伝える|
|Intelligence `apps/v11/index.html` / Primary、Copy、Checkbox、Radio、Textarea、Breadcrumbs、Stepper、Accordion、および`exhibits.css`|`src/components.ts`・`main.ts`・`style.css`。native入力・明示判定ボタン・現在地・進捗の文字＋progress・段階detailsを独自作成。配色・余白・教材用ラベル・データ構造は新規設計|見慣れた入力とボタン、色に依存しない状態表示、確認と選択の分離|

## ソース以外に確認した資料と残件

Loading：`docs/phase4a-inventory.md`、`phase4a-studies.md`、`phase4b-inventory.md`、`phase4b-studies.md`。実装ファイルは展示単位の独立パッケージではなく、React runtime/展示状態と結合しているため、抽出より再構成が適切と判断。GitHubのPR #45/#47はMERGED、#60/#62もMERGED、#64はDraft。open Issue #44は既存Next/Vitest/Tinypool依存の調査、#54はWebKit/実機等の残件であり、教材の検証成功へ読み替えない。参照元の依存は取り込んでいない。

Intelligence：ルートREADMEの「mainは入口・未マージ」という古い記載だけでは判断せず、現行`apps/v11`、そのREADME、`AGENTS.md`、`docs/BACKLOG.md`、`docs/KANBAN-VISUAL.md`、Issue #5/#11/#15、PR #14/#16を確認。文字拡大とKanbanの修正は現行ソースに反映済み。特にrootだけの拡大を実文字2倍と混同しない記録を参考に、本教材はremベースの文字サイズを実測して2倍を確認する。今回の検査はこの教材に限る。

**Stage 3 HOLDは維持**。ミュージアムの公開版、全展示、VoiceOver、依存とライセンス来歴の残件を今回の依頼で解決・承認した扱いにはしない。

## 公式の操作資料

以下は2026-11-05にオンラインで本文を確認した。翻訳・操作名・Pythonの版は変わり得るため、教材内にもURLと確認日を表示する。利用者のPython版は指定しない。

- [Python on Windows](https://docs.python.org/3/using/windows.html)：install manager、python/py、PATH・エイリアスと既存導入のトラブルシューティング。
- [Python in VS Code](https://code.visualstudio.com/docs/python/python-tutorial)：フォルダー、Python: Select Interpreter、.py保存、右クリックのRun Python File in Terminal。
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)：Windows User Setupと既存導入時の考慮。
- [Microsoft Python extension](https://marketplace.visualstudio.com/items?itemName=ms-python.python)：拡張ID、役割、インタープリター選択・実行コマンド。
- [PowerShell overview](https://learn.microsoft.com/en-us/powershell/scripting/overview)：コマンドシェルとしての役割。
- [Python print](https://docs.python.org/3/library/functions.html#print)：文字の表示と既定の改行。

参考資料の文章・画像は転載せず、初心者向けの説明と演習を新規執筆した。
