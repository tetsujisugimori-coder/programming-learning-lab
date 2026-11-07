# WebAssembly基本編 Stage 1

Issue #3。基準main: c0eb748。確認日: 2026-11-08 JST。

## 範囲と設計

第1章8節（正体、実行まで、WAT、初実行、入力変更、命令変更、エラー、制作）と後続12章の目標を実装。応用編は構想段階。章構成は依頼の13章を維持。

既存Pythonの教材データ・表示部品・URL hash・記録意味を変更せず、`mountWasm`が独立DOMを追加する。言語往復はDOMを隠すだけなので入力・ヒント・クイズを維持。再読込では消える。Wasmの安定URLは #wasm-1〜8、#wasm-chapters。Pythonの既存URLは不変。

`wasm-curriculum.ts`に本文・課題・クイズ・段階ヒントと目標を分離。`wasm-learning.ts`は描画、ナビ、記録、実行管理。`wasm-worker.ts`はWABT変換・検証・ブラウザーWasm API実行。Python本文と表示部品は無変更。UIは独自実装で外部Museumのコード転載なし。説明・実行をPC2列/900px以下縦配置。Wasm可変分割とアニメーションは未実装で次段階候補。既存Pythonの可変分割は維持。

## 実行と安全境界

WAT自由編集は16000文字まで。WABT 1.0.39をnpm lockに固定しWorkerへ同梱。CDN接続不要、コードを外部へ送信しない。WABT parseWat → resolveNames → validate → toBinary → WebAssembly.compile → instantiate → calculate(a,b)。変換だけでは実行確認にしない。停止、移動、コード/入力変更、5秒timeoutでWorkerをterminateし、古い応答を棄却する。エラーは変換/ロード/実行を区別。

学習者は任意WATを編集できるが、この入門ラボはcalculate exportと整数戻り値を要求し、外部importは拒否。入力a/bは符号付きi32整数のみ。実行成功は現在のコードと入力に対応し、変更時に失効。読了/クイズ正解/実行確認を別々に記録し、章完了を合成しない。自由記述はHTML escapeして描画し、採点しない。

Worker隔離はUI停止を防ぐ手段であり完全なサンドボックス保証ではない。メモリ要求・ブラウザー自身の脆弱性・資源消費は別問題。5秒はコンパイラー初期化も含み、低速端末では正常コードでも時間切れになり得る。オフライン再起動用Service Workerなし（読み込み済み状態の実行は通信不要）。物理iPhone/VoiceOver/物理タッチはNOT_TESTED。

## 依存とライセンス

- npm wabt 1.0.39、Apache-2.0。upstream WebAssembly/wabt とJavaScript配布 AssemblyScript/wabt.js。ライセンス全文を `public/licenses/wabt-LICENSE` として同梱。
- build時Worker約803KB（非圧縮、WABTを含む）。初回実行時にロード。実行時サーバーなし。
- 既存依存の版は変更しない。npmによる不要なlockメタデータ差分を除外した。

## 公式資料照合

2026-11-08 JSTに本文取得・確認：
- https://webassembly.org/getting-started/developers-guide/ ：Wasmのバイナリ形式、JSとの協働。
- https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/instantiate_static ：バイト列/ModuleとimportObject、インスタンス生成とエラー。
- https://github.com/WebAssembly/wabt/tree/1.0.39 ：wat2wasmと検証、変換ツール。
- https://github.com/AssemblyScript/wabt.js ：npm JavaScript配布元（package.jsonのrepositoryで照合）。

WAT/.wasm、変換/実行、JS/Wasm、実結果/概念図を別表示。スタック図は教材用概念図で命令トレースではない。Wasmの必然的優位を主張しない。

## 再現

Node 24で `npm ci`、`npm run check`、`node tools/verify-python.mjs`。
`npx playwright install --with-deps chromium webkit` 後 `npm run test:e2e`。
`npm run dev` からWebAssemblyを選び、コードを開く→予想→変換→実行。addをsubへ変更し同じ入力で比較。
相対baseによる静的サブパス配信。WorkerのURLはViteのアセット解決を利用。依存ライセンスもdistへ含む。

## 検証と制約

初期実行: npm既定キャッシュ不在で導入失敗、専用キャッシュでnpm ciを完了。lint・型検査・13単体試験・build成功。正常Wasm加算/減算/境界、WAT構文/型エラー、runtime trap、壊れたバイナリのCompileErrorを実行。ローカルブラウザーpilotは起動制約で未完了。Chromium socket EPERM、WebKit共有ライブラリ不足。取得版Chromium archiveにも不完全応答があり、システムChromiumでの試行もEPERM。製品の合否に読み替えない。原ログとpilot結果を保全。

正式ブラウザー計画はChromium/WebKit × 375/390/765/1280 × normal/reduced-motion の16条件。既存Python5シナリオとWasm3シナリオを各条件で実行。CI最終結果はPRの固定HEADと対応させ追記する。

次工程: 独立レビューでWorker終了競合、実Wasmと記録、境界/異常系、Python往復を重点照合。可変分割、永続保存・バックアップ、Wasm関数署名の教材用制約、メモリ上限、実機iPhone操作を優先候補とする。
