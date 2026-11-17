// Deliberately narrow whole-program recognizer, not an arbitrary WAT interpreter.
export type StackStep = { instruction: string; before: number[]; popped: number[]; after: number[] };
export function conceptualStack(code: string, a: number, b: number): { supported: boolean; reason: string; steps: StackStep[] } {
  const reject = (reason: string) => ({ supported: false, reason, steps: [] });
  if (![a,b].every(n => Number.isInteger(n) && n >= -2147483648 && n <= 2147483647)) return reject('i32整数入力が必要です');
  if (typeof code !== 'string' || code.length > 16000) return reject('概念表示は16000文字までです');
  if (/[^\S \t\r\n]/u.test(code)) return reject('WATの空白以外の区切りは可視化非対応です');
  const match = code.match(/^\s*\(module\s+\(func\s+\(export\s+"calculate"\)\s+\(param\s+\$a\s+i32\)\s+\(param\s+\$b\s+i32\)\s+\(result\s+i32\)\s+([\s\S]*?)\)\s*\)\s*$/);
  if (!match) return reject('この構造は可視化非対応です。実Wasmラボで別に検証してください');
  const body = match[1].trim();
  if (!/^(?:local\.get\s+\$[ab]|i32\.(?:add|sub))(?:\s+(?:local\.get\s+\$[ab]|i32\.(?:add|sub)))*$/.test(body)) return reject('命令の区切りまたは文法が非対応です');
  const instructions = body.match(/local\.get\s+\$[ab]|i32\.(?:add|sub)/g) ?? [];
  if (!instructions.length || body.replace(/local\.get\s+\$[ab]|i32\.(?:add|sub)/g, '').trim()) return reject('対応命令はlocal.get $a/$b、i32.add/subのみです');
  if (instructions.length > 256) return reject('概念表示は256命令までです');
  const stack: number[] = [], steps: StackStep[] = [];
  for (const instruction of instructions) {
    const before = [...stack], popped: number[] = [];
    if (instruction.startsWith('local.get')) stack.push(instruction.trim().endsWith('$a') ? a : b);
    else {
      if (stack.length < 2) return reject('スタックの値が不足しています');
      const right = stack.pop()!, left = stack.pop()!; popped.push(right, left);
      stack.push((instruction === 'i32.add' ? left + right : left - right) | 0);
    }
    steps.push({ instruction, before, popped, after: [...stack] });
  }
  if (stack.length !== 1) return reject('result i32には最後の値が1つ必要です');
  return { supported: true, reason: '教材用概念表示。実Wasmの命令トレースではありません', steps };
}
