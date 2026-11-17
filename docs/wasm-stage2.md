# WebAssembly Stage 2

Issue #5。第2章8節を追加。第1章は体験の入口、第2章はmodule/func/export、型、local.get、スタック、減算順序、エラー、説明演習を扱います。章数13を維持し、第3章以降は準備中。

## 実装と学習

`wasm-stage2.ts` は学習目標・予想課題・3段階ヒント・理解チェック。`wasm-stack.ts` は限定構造・命令だけを全体照合する純関数。図の前後、取り出し順、計算結果を文字で表示します。`wasm-learning.ts` は第1章の既存URL `#wasm-1`〜8を維持し、第2章を `#wasm-2-1`〜8として追加。概念図、実行、自由説明、読了を別々に扱います。入力変更時の古い図・結果の失効、Resetで起点focus、言語往復のセッション状態保持を行います。

2引数 `$a`/`$b`、calculate export、result i32、local.get/add/subのみ対応。空白はWATのspace/tab/LF/CRに限定。16000文字・256命令まで。comments、他の正当なWAT構造も非対応になることがあります。非対応はWAT全般の不正判定ではありません。モデルは実命令トレースではなく、WABT/Workerの変更はしていません。

## 保護

`src/curriculum.ts`, `src/components.ts`, `src/main.ts`, `src/wasm-curriculum.ts`, `src/wasm-worker.ts`, package/lock、既存試験、workflow、旧証拠は基準mainから同一。共有wasm-learningとCSSだけを局所拡張。Worker終了、5秒timeout、import拒否、古い通知棄却は既存の実装と試験を維持。

## 検証

事前契約は `wasm-stage2-contract.md`。単体は固定期待値、実WABT/実Wasmの比較、異常構造、境界値、独立レビュー反例を含む。ブラウザは既存16条件の設定を変更せず第2章の予想・ステップ・実行・編集・拒否・停止・再実行・言語往復・focus・computed文字2倍を追加。

局所Chromium pilotは実行ファイル不在でBLOCKED。製品のFAILではなく環境起動失敗。正式CI結果は固定HEADに対応したPR追補を参照。実機iPhone Safari・物理keyboard・VoiceOver・物理touchはNOT_TESTED。独立レビューと原artifact保全の完成前は総合PARTIAL・マージNO。

## 仕様根拠

2026-11-17 UTCにWebAssembly公式specの命令規則を読取確認。https://github.com/WebAssembly/spec/blob/main/document/core/exec/instructions.rst （関数実行、local.get、数値命令）。実行確認はlock固定WABT 1.0.39で別途行う。最新版の仕様読取を実機試験と混同しない。

### 初回正式CIの失敗履歴

提出a1ee9d06のpush run44061987963 / PR run44062040904はいずれも232 PASS・16 FAIL・8 SKIP。追加第2章specのリンク選択がhidden章カード・前節リンクも含む3要素へ一致し、strict-modeで16条件とも停止。製品の演算/型拒否/停止・再実行までは到達していたが、後半のナビ/focus/文字拡大は未到達。選択を可視nav内へ限定し、第1節への復帰focusをその場で確認してから2〜8節へ進むよう修正。期待値・timeout・既存試験は変更しない。旧FAILを成功に読み替えず原artifactを保持する。

### 文字200%の正式反例

21af8c39の正式push run44063952801では240 PASS・8 FAIL・8 SKIP。第2章は広幅765/1280で成功し、両engine×375/390×motionの8条件のみcomputed文字32px後の横overflow検査が失敗。これは環境起動ではなく表示の実FAIL。Wasm専用範囲で長い語の折返し、header/barのflex折返し、入力の最小幅解除、狭幅1列化を追加する。overflowを隠す方法や期待幅の緩和は使わない。同一試験で再確認する。Pythonへの適用はしない。
