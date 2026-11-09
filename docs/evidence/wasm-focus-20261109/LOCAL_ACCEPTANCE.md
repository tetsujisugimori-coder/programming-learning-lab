# フォーカス制御修正・独立ローカル再受入

## 判定
総合PARTIAL（物理端末・支援技術未検証、最終CIは本資料保存後に別途照合）。ローカル技術範囲PASS。限定マージ推奨は最終CIと正式独立レビュー後にPRコメントで確定する。Draft維持、マージ・公開なし。

## 実測と修正
元HEAD34422bfのPython節／章一覧への復帰は、16条件×2経路=32件すべて失敗。非表示のPython祖先の下にfocus()していた。画面切替を単一hashchange処理へ集約し、表示を復元してから教材内のフォーカスを設定した。Wasm内遷移にPythonのナビゲーションを実行しない。

独立担当が初修正版の#main履歴復帰を追加検証し、16条件すべてでBODYへのフォールバックを検出。単に「非表示でない」とする検査では不十分だったため、#main自身へのフォーカスを要求する検査に強化し、表示復元後のmain.focus()を追加した。最終独立検査で全条件PASS。

## 最終ローカル検証
- 検証コードremote HEAD d52e363fb476985f0ec48939619db424ae36e86e
- tree ed82d47e29c3eb156ef373f55c55e870d30214dd
- 独立検証local commit16099ef0503c14a04f3efb2d1247b55af5c4f6f0と同一tree。CLI pushは資格情報不在で失敗、正規GitHub連携で同一treeを提出しremote refを確認。
- lint、型検査、単体13件、production build成功。Python教材例は正常9件＋意図したエラー1件。
- Chromium141.0.7390.37 / WebKit26.0、幅375/390/765/1280、通常/reducedの16条件。Playwright1.56.1、Linux、ブラウザ自動操作。
- 既存136 PASS /0 FAIL /8 SKIPを維持。追加フォーカス6経路×16=96 PASS。合計232 PASS /0 FAIL /8 SKIP /0 flaky。
- 既存WebKit clipboard readback8件のSKIPはPASSに含めない。
- 独立担当の別checkout・独自probeは16条件×4=64 PASS。PythonのDOM同一性・メモ・読了・PC自己申告・クイズ・ヒント・分割状態、実Worker終了、移動後／新Worker実行中の古い成功・失敗callback棄却、再実行の結果5を確認。
- 非表示または非描画要素へのfocus呼出し0件、隠れた最終フォーカス0件。

## 原証拠
before-evidence.zipとbefore-sha256.jsonに修正前32件と直接再現の原JSON・ログ・画像・trace。
acceptance-local-evidence.zipとacceptance-sha256.jsonに最終全体結果JSON、96件の操作フォーカスログ、代表4画像、独立probe・64件の原結果、負対照32件と厳密#main16件、実行ログ、hashを保全。
正式GitHub Actionsはlockfile固定Playwright1.58.2を使う。ローカル補助版1.56.1と混同しない。CIの実行HEAD/tree・原artifact・件数はPRの最終報告で別に記録する。旧証拠は上書きしていない。

## 未検証・引継ぎ
実機iPhone Safari、物理キーボード、VoiceOverはNOT_TESTED。ブラウザの自動フォーカス成功は支援技術の読上げ順序や実機受入を意味しない。Worker隔離は全資源安全性の保証ではない。次工程は物理端末・支援技術で同じ8操作経路を確認し、独立した証拠として保存すること。
