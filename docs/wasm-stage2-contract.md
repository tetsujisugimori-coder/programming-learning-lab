# Stage 2 事前受入契約

基準 main dc32b8396b1042b55d1b4a99b8ffa1494a5fa188 / tree 51814b9efeef1616afeefc7c70ce37985bc97f3f。PR #4 はマージ済み（古いPR本文の未マージ表記とは区別）。2026-11-17 UTC。

第2章8節のみ追加し13章を維持。学習目標・予想・観察・実行・比較・説明、3段階ヒントと理解チェックを各節に設ける。
可視化は限定文法（2つの名前付きi32引数、calculate export、local.getとadd/sub）だけを解析する教材モデル。全コードの一致を確認できない場合は非対応とし、図を破棄する。実WABT/Workerとは独立、任意WATのトレースを主張しない。

正常：add/sub、順序逆転、0/負数/32bit折返し、各スタック前後。異常：構文/型/未対応命令/余剰コード/不正入力を拒否。編集時図と実結果を失効。Resetは起点へfocus。停止と古い通知棄却は維持。

Python教材データ・表示部品・既存URL・Worker・lockfile・既存試験期待値は保護する。新単体と既存回帰、Chromium/WebKit×375/390/765/1280×normal/reducedの16条件で既存回帰と第2章を検証。SKIPは成功にしない。実機Safari/物理keyboard/VoiceOverは別途NOT_TESTED。

既存workflowはpush/PR双方でcheck/browserとartifact保存を実施する。今回の承認された正式検証として実行し、重複eventを別条件と数えない。独立レビュー・原artifact保存/読戻し結果は後記し、未完なら総合PARTIAL。
