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
