export const wasmChapters = [
 ['WebAssemblyとは何か', 'WATを変更し、実行結果を自分の言葉で説明する'],
 ['WATの基本文法', 'テキスト形式の構造と命令を読む'], ['数値・型・演算', '数値型とオーバーフローを説明する'],
 ['関数・引数・戻り値', '関数の契約を設計する'], ['JavaScriptとの連携', 'importとexportの役割を理解する'],
 ['メモリの仕組み', '線形メモリを読み書きする'], ['制御構造と繰り返し', '分岐と反復を組み立てる'],
 ['C・Rustからのコンパイル', 'ツールチェーンからWasmを生成する'], ['デバッグとエラー調査', '段階ごとの失敗を調べる'],
 ['パフォーマンスと測定', '同じ条件で測定し比較する'], ['ブラウザ以外での実行', 'ホストとWASIの役割を知る'],
 ['安全性と実行環境', '権限・資源制限・importを評価する'], ['基本編の制作課題', '制作・検証・説明を一巡する'],
];
export const sampleWat = `(module
  (func (export "calculate") (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add))`;
export const wasmLessons = [
 { title: 'WebAssemblyの正体', text: 'WebAssembly（Wasm）は、型付き命令を持つバイナリ形式と実行モデルです。ブラウザーはその命令を検証し実行します。JavaScriptを置き換えるものではなく、画像処理や既存コードの移植などで協働します。DOM操作や画面入力はここではJavaScriptが担当します。必ずJavaScriptより速いわけではありません。', task: '入力2と3を足す役割を、画面とWasmのどちらが担当するか予想しよう。', question: 'この教材でDOMを更新するのは？', options: ['JavaScript', 'Wasm自身のDOM命令'], correct: 0, explanation: 'JavaScriptが画面を担当し、Wasmの戻り値を表示します。', hints: ['画面の入力欄と計算を分けて考える。','Wasmへ渡すのは2つの整数。','JavaScriptが入力を読み、Wasmが加算し、JavaScriptが表示する。'] },
 { title: 'コードから実行まで', text: 'WATは人が読めるテキスト表現、.wasmはバイナリ表現です。ブラウザーのWebAssembly APIはWATを直接読まないため、この教材では同梱のWABTが変換します。変換・検証 → バイナリ → instantiate → 関数呼出し、という段階を区別しましょう。CやRustから作る経路は後続章で扱います。', task: '変換ボタンだけで計算が実行されるか予想し、変換と実行を別々に操作しよう。', question: 'WebAssembly.instantiateへ渡す形式は？', options: ['WATの文字列そのもの', 'Wasmのバイト列など'], correct: 1, explanation: 'この教材ではWABTで作ったバイト列を渡します。', hints: ['テキストとバイナリは別形式。','変換表示の先頭00 61 73 6dを見る。','WAT → WABT → バイト列 → WebAssembly API。'] },
 { title: 'WATを読んでみる', text: 'moduleは全体、funcは関数、paramは引数、resultは戻り値の型、exportは外から呼ぶ名前です。i32は32ビット整数。local.get $aと$bは引数をスタックへ積み、i32.addは2値を取り出して和を積みます。下の図は教材用の概念図で、実行中の命令トレースではありません。', task: 'コードを開き、2つのparamと1つのresult、export名calculateを見つけよう。', question: '外部から呼ぶ名前を指定するのは？', options: ['param', 'export'], correct: 1, explanation: 'exportがJavaScriptに公開する名前を定めます。', hints: ['関数の最初の行に注目。','(export "calculate")を探す。','module［func［param a,b → result i32］］という入れ子。'] },
 { title: '初めてのWasm実行', text: 'コードを表示して変換・検証し、実行してみましょう。Worker内でWebAssembly.instantiate(bytes, {})を呼び、instance.exports.calculate(a,b)の戻り値を得ます。表示例ではなく実際のWasmの結果です。この教材では外部importを許可せず、画面と実行を分離しています。', task: '2と3の結果を記入してから実行し、予想との差を説明しよう。', question: '実行確認の記録はいつ付く？', options: ['実Wasmが正常終了したとき', 'コードを表示したとき'], correct: 0, explanation: '正常な実行結果の受信を記録し、読了やクイズとは分離します。', hints: ['予想は先に自分で書く。','変換結果と計算結果は違う。','2 + 3は5。実行して画面で確かめる。'] },
 { title: '入力値を変更する', text: '入力値だけの変更とプログラムの命令変更は別です。入力は符号付きi32の整数（−2147483648〜2147483647）に限定しています。i32演算は32ビットで折り返し、例えば2147483647 + 1は−2147483648です。これはエラーではありません。小数・範囲外・空欄は実行前に拒否します。', task: '負数、0、最大値+1を一つずつ試し、結果の理由をメモしよう。', question: 'i32最大値に1を加えると？', options: ['必ずエラーになる', '32ビットで折り返す'], correct: 1, explanation: 'i32.addは剰余2の32乗の演算で、表示は符号付きです。', hints: ['まず0 + 1を試す。','次に2147483647 + 1。','ビット幅は増えないので−2147483648と表示される。'] },
 { title: '命令を変更する', text: 'i32.addをi32.subへ一か所だけ変更しましょう。subは先に積んだaから後に積んだbを引きます。例：a=7,b=2なら5。変える前後のコード・入力・結果を記録し、同時に複数の条件を変えないことが調査の基本です。', task: '7と2を入力し、加算を実行後、命令だけsubに変えて再実行しよう。', question: 'a=7,b=2でi32.subの結果は？', options: ['−5', '5'], correct: 1, explanation: 'local.get a, local.get bの順ならa−bです。', hints: ['変更はi32.addの一語だけ。','local.getの順序は維持する。','i32.subへ変更し7−2=5を確認する。'] },
 { title: 'エラーを調べる', text: '閉じ括弧の不足はWAT構文エラー、result i32にf32を返すと型検証エラーです。変換後のバイナリもブラウザーが検証します。unreachableは有効な命令ですが実行するとtrapになります。画面は段階と原文メッセージを表示します。先頭のエラー位置から小さく修正し、もう一度試しましょう。停止・時間切れは成功には数えません。', task: '括弧を1つ消す → 直す → i32.addをunreachableへ変える、を別々に試そう。', question: '有効なバイナリなら実行時エラーは起きない？', options: ['起こり得る', '起こらない'], correct: 0, explanation: '検証成功でもunreachableやゼロ除算などのtrapは起きます。', hints: ['エラーの段階表示を読む。','変換エラーと実行trapは別。','リセットで原本へ戻し、一か所ずつ変更する。'] },
 { title: '小さな制作課題', text: '加算または減算を選ぶ小さな計算プログラムを作りましょう。画面入力の検証と表示はJavaScript、計算命令はWasmという役割分担を説明してください。正常値、負数、境界値、意図的な誤りを試し、予想と異なる結果から修正します。実行成功だけで理解できたとは判定しません。', task: '自分でsub版を作り、3組の入力・予想・実測結果と修正理由をメモしよう。', question: '学習の確認として適切なのは？', options: ['実行できたので全理解とする', '変更と結果の関係を自分で説明する'], correct: 1, explanation: '読了、クイズ、実行は別の証拠で、自動的に章完了とはしません。', hints: ['最初は固定の加算と減算でよい。','画面の値だけ変えた場合とコード変更を区別。','add版とsub版を同じ入力で比べ、根拠を文章にする。'] },
];
