export type Block = { heading?: string; text?: string; list?: string[]; command?: string; note?: string };
export type Example = { id: string; kind: 'python' | 'command'; code: string; output?: string; error?: boolean };
export type Lesson = {
  id: string; title: string; lead: string; blocks: Block[]; example?: Example;
  prediction: string; practice: string; verify: string; pc: boolean;
  quiz: { id: string; question: string; options: string[]; correct: number; reasons: string[]; hint: string };
  hints: [string, string, string]; solution?: Example;
};
export type Chapter = { id: string; title: string; goal: string; ready: boolean };
export const languages = [
  { id: 'python', name: 'Python', status: '基本編' },
  { id: 'shell', name: 'PowerShell / Shell', status: '今後追加' },
  { id: 'typescript', name: 'TypeScript', status: '今後追加' },
];
export const chapters: Chapter[] = [
  ['表示と実行', '実行環境を確認し、文字を表示するコードを自分で変更できる。'],
  ['数値と文字', '数値と文字の違いを説明し、計算と文字の表示を使い分ける。'],
  ['変数', '値に名前を付け、値を変更したときの結果を説明する。'],
  ['入力', '入力を受け取り、プログラムの結果へ反映する。'],
  ['条件分岐', '条件によって処理を分け、通る道を予想する。'],
  ['複数のデータ・リスト', '複数の値をまとめ、必要な値を取り出して変更する。'],
  ['繰り返し', '同じ処理を繰り返し、実行順と回数を説明する。'],
  ['名前と値の対応・辞書', '名前と値を対応させ、キーを使って値を取り出す。'],
  ['関数', '処理に名前を付け、引数と戻り値の関係を説明する。'],
  ['エラーと調べ方', 'エラーの位置と種類を手掛かりに原因を調べる。'],
  ['ファイルの保存と読込み', '文字をファイルに保存し、読み込んで確かめる。'],
  ['モジュールと標準ライブラリ', '既存の機能を読み込み、公式資料を見ながら利用する。'],
  ['基本編の制作', '小さな制作物を設計し、変更・実行・確認を繰り返す。'],
].map(([title, goal], i) => ({ id: `py-basic-ch${String(i + 1).padStart(2, '0')}`, title, goal, ready: i === 0 }));

export const lessons: Lesson[] = [
  {
    id: 'py-ch01-goals', title: 'この章でできるようになること',
    lead: '最初の一歩は、たった1行。自分の指示で、画面の文字が変わる体験から始めましょう。',
    blocks: [
      { heading: '今日のゴール', list: ['手元のWindowsでPythonの実行環境を確認する。', '文字を表示する短いコードを書いて実行する。', '表示する文字や行の順番を、自分で変更する。', '小さな誤りを読み、直してもう一度確かめる。'] },
      { heading: '正解を写す前に、ひと呼吸', text: '短い例を読み、何が表示されるか予想します。その後、自分のPCで実行して比べ、文字を一部変えて確かめます。最初から全部覚える必要はありません。' },
      { note: 'iPhoneでは、説明を読む・予想を書く・理解チェックに答える学習ができます。「PCで実習」はWindowsのPCに移って取り組んでください。' },
      { text: 'このサイトはPythonを実行しません。「表示例」は教材として用意した例です。PCの実行成功はサイトから観測できず、実行記録はあなたの自己申告として扱います。' },
    ],
    prediction: '文字を1か所変えると、画面の何が変わると思いますか。今の考えをメモしましょう。',
    practice: '読み終えたら、今回表示してみたい短い言葉を1つ考えてください。',
    verify: '「コードを自分で変えて確かめる」が、この章の目標です。', pc: false,
    quiz: { id: 'py-ch01-goals-check', question: 'この章で目指す学び方は？', options: ['完成コードを覚えて、そのまま写す', '予想し、PCで実行し、一部を変えて確かめる'], correct: 1, reasons: ['写すだけでは、どの指示が結果を変えたか分かりにくいですね。', '正解。指示と結果のつながりを、自分の変更で確かめます。'], hint: '表示する文字を変える場面を想像してみましょう。' },
    hints: ['まずは「こんにちは」のような短い言葉で十分です。', '変えるのは言葉だけ、という小さな変更から始めます。', '例：「おはよう」に変え、表示も「おはよう」になるか確かめる。'],
  },
  {
    id: 'py-ch01-flow', title: 'コードから結果までの道のり',
    lead: 'コードは、コンピューターへの指示を書いた文章です。保存した指示をPythonが読み、結果を表示します。',
    blocks: [
      { heading: '4つの道具の役割', list: ['VS Code：コードを書く・保存するための編集アプリ。', 'Python本体：Pythonのコードを読み、指示を実行するプログラム。', 'Microsoft製Python拡張機能：VS CodeでPythonを選び、実行しやすくする追加機能。Python本体とは別です。', 'PowerShell：コマンドを入力して、プログラムを呼び出す道具。ターミナルはそのやり取りを表示する場所です。'] },
      { heading: '書く → 実行する → 表示される', text: 'VS Codeでchapter01.pyにコードを書いて保存 → 選択したPython本体が実行 → ターミナルに結果が表示される、という流れです。拡張機能だけを入れても、Python本体の代わりにはなりません。' },
      { note: '右（スマホでは下）の図は概念図です。実際のWindows画面や、あなたのPCの実行成功を示す画面ではありません。' },
    ],
    example: { id: 'py-ch01-flow-example', kind: 'python', code: 'print("こんにちは")', output: 'こんにちは' },
    prediction: 'コードを保存しただけで、結果は表示されるでしょうか。理由も考えてみましょう。',
    practice: '概念図の「書く」「実行」「表示」を、自分の言葉で言い換えてみてください。',
    verify: '保存と実行は別の操作です。コードを変えたら保存し、もう一度実行します。', pc: false,
    quiz: { id: 'py-ch01-flow-check', question: '保存したPythonコードを実行するのは？', options: ['Python本体', 'Python拡張機能だけ'], correct: 0, reasons: ['正解。VS Codeや拡張機能から呼び出されたPython本体が実行します。', '拡張機能は実行を助ける道具です。本体を選んで呼び出します。'], hint: '指示を実際に読む道具と、編集を助ける道具を分けて考えましょう。' },
    hints: ['VS Codeは書く場所です。', 'Python本体が実行し、ターミナルに結果が出ます。', '例：「ノートに指示を書く → Pythonに読んでもらう → 結果を見る」。'],
  },
  {
    id: 'py-ch01-setup', title: 'Windowsの環境を確認する',
    lead: 'すでに使える道具があれば、そのまま始められます。まず確認し、足りないものだけを用意しましょう。',
    blocks: [
      { heading: '1. Pythonが見つかるか確認', text: 'WindowsのスタートメニューでPowerShellを開き、次のコマンドを入力してEnterを押します。コマンドはPowerShellへ入力し、.pyファイルには書きません。', command: 'python --version' },
      { text: '「Python」に続いてバージョン番号が表示されたら、このコマンドでPythonを呼び出せています。表示された番号をメモしてください。教材と同じ番号である必要はありません。' },
      { text: '「見つからない」「認識されない」、Storeが開く、番号が出ない場合は、それだけで未インストールとは判断しません。補助として次も確認します。', command: 'py --version' },
      { text: 'pyで番号が出た場合もPythonは見つかっています。VS CodeでそのPythonを選びます。両方で番号が出ない場合は、インストール済みアプリ、コマンドのつづり、PATH（プログラムを探す場所の設定）、アプリ実行エイリアスを公式のトラブルシューティングで確認します。導入直後ならPowerShellとVS Codeを開き直してください。' },
      { heading: '2. 足りないものだけ用意', list: ['Python本体がないと確認できた場合：python.orgのWindows向け公式案内からPython install managerを導入し、その案内に沿ってPythonを用意します。既存環境の削除や再インストールを先に行う必要はありません。組織のPCでは管理者の案内に従ってください。', 'VS Codeがなければ：公式のWindows用User Setupを取得し、画面の案内に沿って導入します。すでに起動できる人は不要です。', 'VS Codeの拡張機能画面（Ctrl+Shift+X）で「Python」を探し、発行元Microsoft、拡張ID ms-python.pythonを確認します。導入済みなら有効か確認し、なければInstallを選びます。', 'PowerShellはコマンドを入力するために使います。すでに開ける場合、別の版への入れ替えはこの章に必要ありません。'] },
      { heading: '3. 学習用フォルダーを開く', text: 'エクスプローラーで、自分が作業してよい場所にpython-learningフォルダーを作ります。VS Codeの「ファイル > フォルダーを開く」（File > Open Folder）で選択します。信頼を尋ねられた場合は、自分で作ったフォルダーであることを確認して判断します。' },
      { heading: '4. Pythonを選び、ファイルを保存', text: 'Ctrl+Shift+Pでコマンドパレットを開き「Python: Select Interpreter」を選択。確認できたPython本体を選びます。新規ファイルにchapter01.pyと名前を付けて保存してください。.py.txtになっていないことも確認します。候補が出なければ拡張機能の有効状態と本体の場所を確認します。' },
      { heading: '5. ターミナルの準備', text: '「Terminal: Select Default Profile」でPowerShellを選び、新しいターミナルを開くとコマンド入力にも使えます。Pythonの実行には次の節の「Run Python File in Terminal」を使います。仮想環境や追加パッケージの導入は、この章には必要ありません。' },
      { note: 'インストールは学習者自身が必要性を確認して行います。このサイトからPCに自動導入・設定変更はしません。公式資料の確認日：2026-11-05。画面や翻訳、番号は環境によって異なります。' },
    ],
    example: { id: 'py-ch01-setup-example', kind: 'command', code: 'python --version' },
    prediction: '番号が出る／認識されないなど、何が表示されると思いますか。実際に出た番号や状況もメモしてください。',
    practice: '既存環境を確認し、chapter01.pyを保存します。フォルダー名を自分で分かる名前に変えても構いません。',
    verify: '番号または状況を確認し、使うPythonを選べたか見直しましょう。分からない場合は無理に削除せず、公式資料を参照してください。', pc: true,
    quiz: { id: 'py-ch01-setup-check', question: 'python --versionが認識されなかった。次は？', options: ['Pythonがないと断定して再インストールする', 'py --versionや既存アプリ、設定を確認する'], correct: 1, reasons: ['コマンドの探索設定だけが原因の場合もあります。単一の失敗では断定できません。', '正解。既存環境を確認し、必要な場合だけ導入します。'], hint: '「見つからない」と「存在しない」は同じでしょうか。' },
    hints: ['番号が出た場合、再インストールは不要です。', 'pyで番号が出るなら、そのPythonをVS Codeで選べます。', '確認例：pythonが認識されない → pyで番号を確認 → Python: Select Interpreterで選ぶ。どちらも失敗したら公式の設定確認へ。'],
  },
  {
    id: 'py-ch01-first-print', title: '初めてのprint',
    lead: 'printは、文字などを表示するための指示です。まずは短いあいさつを表示してみます。',
    blocks: [
      { heading: '記号にも役割がある', text: 'printの後の半角の括弧 ( ) は、表示したいものを囲みます。その中の半角の引用符 " " は、ここからここまでが文字だと示します。引用符そのものは表示されません。日本語の「 」や全角の（ ）で代用しないでください。' },
      { heading: '予想してから、PCで実行', text: '例をchapter01.pyに書き、Ctrl+Sで保存します。エディター内で右クリックし「Run Python > Run Python File in Terminal」（ターミナルでPythonファイルを実行）を選びます。右上のPython実行ボタンからも実行できます。ターミナルのコマンド行の次に出る文字を見て、予想と比べてください。' },
      { note: 'ボタンが見当たらない場合は、.pyファイルを開いているか、Microsoft製Python拡張が有効か、Python本体が選択されているか確認します。Code Runnerなど別の拡張はこの教材の前提ではありません。' },
    ],
    example: { id: 'py-ch01-first-print-example', kind: 'python', code: 'print("こんにちは")', output: 'こんにちは' },
    prediction: '引用符も表示されるでしょうか。表示される1行を予想して書いてください。',
    practice: '引用符の内側だけを「おはよう」に変え、保存して同じ方法で実行します。',
    verify: '文字だけが変わりましたか。引用符と括弧を残したまま変更できたか確認します。', pc: true,
    quiz: { id: 'py-ch01-first-print-check', question: 'print("こんにちは")の表示は？', options: ['こんにちは', '"こんにちは"'], correct: 0, reasons: ['正解。引用符は文字の範囲を示す記号なので、表示には含まれません。', '引用符は文字の範囲を示します。表示されるのは内側の文字です。'], hint: '記号はPythonに伝えるためのものです。' },
    hints: ['括弧と引用符は半角で書きます。', '変えるのは引用符の内側だけです。', '変更例：print("おはよう")。表示は「おはよう」です。'],
    solution: { id: 'py-ch01-first-print-change', kind: 'python', code: 'print("おはよう")', output: 'おはよう' },
  },
  {
    id: 'py-ch01-order', title: '2行の実行順を予想する',
    lead: 'このように並んだ指示は、上の行から順に実行されます。2行にすると、順番が目に見えてきます。',
    blocks: [
      { heading: '1行ずつ追ってみる', text: '1行目のprintで文字が表示され、改行します。それから2行目のprintが実行されます。2つの言葉がどの順番で出るか、実行する前に予想しましょう。' },
      { text: 'chapter01.pyの内容をこの2行に置き換えて保存し、「Run Python File in Terminal」で実行します。前の実行結果がターミナルに残っている場合は、最後に実行した結果と比べてください。' },
    ],
    example: { id: 'py-ch01-order-example', kind: 'python', code: 'print("朝です")\nprint("出かけよう")', output: '朝です\n出かけよう' },
    prediction: '最初と次に何が出ますか。2行に分けて予想してください。',
    practice: '2行を入れ替えて、保存・実行します。言葉そのものは変えず、順番だけを変えてみましょう。',
    verify: 'コードの順番と表示の順番が、どちらも入れ替わりましたか。', pc: true,
    quiz: { id: 'py-ch01-order-check', question: '例の2行を上下入れ替えると？', options: ['表示順は変わらない', '出かけよう → 朝です、の順になる'], correct: 1, reasons: ['この例は上から順に実行します。コードの順番が表示順に影響します。', '正解。上のprintが先に実行されます。'], hint: '入れ替えた後の1行目に、指を置いてみましょう。' },
    hints: ['上の行を先に読みます。', '2行全体を入れ替えます。printや引用符を削る必要はありません。', '入れ替え後は「出かけよう」が先、「朝です」が次です。'],
    solution: { id: 'py-ch01-order-change', kind: 'python', code: 'print("出かけよう")\nprint("朝です")', output: '出かけよう\n朝です' },
  },
  {
    id: 'py-ch01-change', title: '自分の言葉に書き換える',
    lead: '今度は、例の文字を自分で決めます。指示の形を保ち、中身だけを変える練習です。',
    blocks: [
      { heading: '一度に変える場所を小さく', text: '例の「今日は晴れ」を、自分が表示したい短い言葉に置き換えます。半角の括弧と引用符を残し、内側の文字だけを変えましょう。ここでは文の中に半角の引用符を入れずに試してください。' },
      { text: '予想を書き、chapter01.pyを変更してCtrl+Sで保存します。同じ実行操作を行い、自分で決めた文字になったか確認します。' },
      { note: '下書き欄はメモです。入力したコードをサイトで実行・採点する機能はありません。PCのファイルへ自分で反映してください。日本語の変換確定だけで次の節へ進むことはありません。' },
    ],
    example: { id: 'py-ch01-change-example', kind: 'python', code: 'print("今日は晴れ")', output: '今日は晴れ' },
    prediction: 'どんな文字に変えますか。変更したコードと、予想する表示をメモしてください。',
    practice: '1回目は言葉だけを変更。2回目は別の言葉にして、毎回保存・実行して比べます。',
    verify: '変更前と変更後で、同じ記号と変わった文字を説明してみましょう。説明は自動採点しません。', pc: true,
    quiz: { id: 'py-ch01-change-check', question: '文字だけを変えたいとき、まず変更するのは？', options: ['引用符の内側', 'printのつづり'], correct: 0, reasons: ['正解。指示の形を残して、表示したい文字だけを変更します。', 'printは指示の名前です。変えると同じ指示として読めなくなります。'], hint: 'どこが「表示する内容」を表しているでしょうか。' },
    hints: ['引用符で囲まれた場所を探しましょう。', '例：今日は晴れ → 今日は雨。括弧や引用符はそのままです。', '変更例：print("今日は雨")。表示が「今日は雨」になるかPCで確かめます。'],
    solution: { id: 'py-ch01-change-answer', kind: 'python', code: 'print("今日は雨")', output: '今日は雨' },
  },
  {
    id: 'py-ch01-error', title: '小さな誤りを読み解く',
    lead: 'エラーは、直す場所を探す手掛かりです。わざと記号を1つ忘れ、何を教えてくれるか見てみましょう。',
    blocks: [
      { heading: 'この例は意図的なエラー', text: '右のコードは閉じる括弧が欠けています。普段のファイルを壊さないよう、chapter01.pyの内容を確認してからこの短い例に置き換え、保存・実行します。' },
      { heading: '全部を訳さず、手掛かりを拾う', text: 'エラーにあるファイル名や行番号、SyntaxError（書き方の規則に合わないという種類）を探します。矢印や文章が示す周辺の記号を確認してください。原因が示された位置の少し前にある場合もあります。' },
      { note: '表示例は代表例です。Pythonの版によって文章・矢印・行の表示が異なります。同じ文章が出なくても誤答ではありません。SyntaxErrorは今回のような書き方の問題を調べる手掛かりです。' },
      { text: '欠けている記号を1つ補い、保存して再実行します。まだエラーなら、全角の括弧・曲がった引用符・引用符の閉じ忘れがないか、1つずつ見比べます。' },
    ],
    example: { id: 'py-ch01-error-example', kind: 'python', code: 'print("こんにちは"', output: "SyntaxError: '(' was never closed", error: true },
    prediction: '文字は表示されるでしょうか。どの記号が足りないと思いますか。',
    practice: '閉じる半角の括弧を補い、保存・実行して、エラーが出たときと比較します。',
    verify: '「足りない記号 → 補った記号 → 表示の変化」を、自分の言葉で説明してください。', pc: true,
    quiz: { id: 'py-ch01-error-check', question: 'この例で、最初に試す修正は？', options: ['閉じる半角の括弧 ) を末尾へ足す', 'エラーの文章をコードに書き足す'], correct: 0, reasons: ['正解。括弧の対応を直し、保存して再実行します。', 'エラーの文章は調査の手掛かりです。コードへ貼るのではなく、欠けた記号を探します。'], hint: '開いた括弧には、対応する閉じる括弧が必要です。' },
    hints: ['開く括弧と閉じる括弧を数えましょう。', '引用符は閉じています。最後に必要な半角記号は何でしょう。', 'print("こんにちは") に直し、PCで保存して再実行します。'],
    solution: { id: 'py-ch01-error-fixed', kind: 'python', code: 'print("こんにちは")', output: 'こんにちは' },
  },
  {
    id: 'py-ch01-task', title: '小さな課題と振り返り',
    lead: '最後は、2行のメッセージを自分で作ります。例を見ずに考え、必要なときにヒントを開いてください。',
    blocks: [
      { heading: '課題：明日の自分へのメッセージ', list: ['1行目に短いあいさつ、2行目に明日やりたいことを表示する。', 'それぞれの行にprintを使い、chapter01.pyへ保存する。', '表示される順番を予想してから、PCで実行する。', '2行目の文字だけを別の内容に変更し、もう一度保存・実行する。'] },
      { heading: '自分で確かめる基準', text: '2行に表示できたか。予想と順番が合っていたか。変更した部分だけが変わったか。この3つを実際の結果と照らし合わせます。解答例と同じ言葉である必要はありません。' },
      { heading: '振り返ってみよう', text: '「括弧と引用符は何のため？」「上から順に、とは？」「うまくいかないとき何を見た？」を下書き欄へ書いてみてください。自由記述を単語の一致で自動採点することはありません。' },
      { note: '読了・理解チェックの正解・PCで実行した自己申告を、別々に記録します。再読込で記録は消えます。続きの第2章以降は目標の一覧のみで、本文は準備中です。' },
    ],
    prediction: '自分の2行のコードと、予想する表示を下書きしましょう。',
    practice: 'PCで実行して、2行目だけを変更して再実行します。最初と変更後の結果をメモしてください。',
    verify: '今なら自分で変更できそうな部分と、もう一度読みたい部分を1つずつ書いてみましょう。', pc: true,
    quiz: { id: 'py-ch01-task-check', question: '2行目だけの文字を変更し、保存して再実行すると？', options: ['1行目も必ず変わる', '1行目は同じで、2行目の表示が変わる'], correct: 1, reasons: ['1行目の指示は変更していません。変更した場所と結果の関係を考えましょう。', '正解。自分で変更した指示と結果の対応を確かめられました。'], hint: 'どのprintの中身を変更したか、追ってみましょう。' },
    hints: ['表示を2行にしたいので、printを2回使います。', '各行を print("表示したい文字") の形で書きます。上の行が先に実行されます。', 'あくまで一例です。自分の言葉で2行に表示できれば、同じ答えにする必要はありません。'],
    solution: { id: 'py-ch01-task-answer', kind: 'python', code: 'print("おはよう")\nprint("明日は散歩する")', output: 'おはよう\n明日は散歩する' },
  },
];

export const officialSources = [
  { label: 'Python公式：Windowsでの利用・導入・トラブルシューティング', url: 'https://docs.python.org/3/using/windows.html' },
  { label: 'VS Code公式：Pythonの準備・選択・保存・実行', url: 'https://code.visualstudio.com/docs/python/python-tutorial' },
  { label: 'VS Code公式：Windowsへの導入', url: 'https://code.visualstudio.com/docs/setup/windows' },
  { label: 'Microsoft公式：Python拡張機能（ms-python.python）', url: 'https://marketplace.visualstudio.com/items?itemName=ms-python.python' },
  { label: 'Microsoft公式：PowerShellとは', url: 'https://learn.microsoft.com/en-us/powershell/scripting/overview' },
  { label: 'Python公式：print', url: 'https://docs.python.org/3/library/functions.html#print' },
];
