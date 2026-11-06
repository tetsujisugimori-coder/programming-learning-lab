// Executes only the authored, fixed curriculum examples. Never learner input.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { lessons } from '../src/curriculum.ts';

const python = process.env.PYTHON_EXECUTABLE || 'python';
const version = spawnSync(python, ['--version'], { encoding: 'utf8' });
if (version.status !== 0) throw new Error('Python version check failed');
const normal = [], intentionalErrors = [];
for (const lesson of lessons) {
  for (const example of [lesson.example, lesson.solution].filter(Boolean)) {
    if (example.kind !== 'python') continue;
    const result = spawnSync(python, ['-X', 'utf8', '-c', example.code], { encoding: 'utf8' });
    const record = { id: example.id, code: example.code, exitCode: result.status, stdout: result.stdout, stderr: result.stderr };
    if (example.error) {
      if (result.status === 0 || !result.stderr.includes('SyntaxError')) throw new Error(`Expected SyntaxError: ${example.id}`);
      intentionalErrors.push(record);
    } else {
      if (result.status !== 0 || result.stdout.replace(/\r\n/g, '\n') !== `${example.output}\n`) throw new Error(`Unexpected output: ${example.id}`);
      normal.push(record);
    }
  }
}
mkdirSync('docs/evidence', { recursive: true });
writeFileSync('docs/evidence/python-results.json', JSON.stringify({ checkedAt: new Date().toISOString(), version: version.stdout.trim(), normal, intentionalErrors }, null, 2) + '\n');
console.log(`${version.stdout.trim()}: ${normal.length} normal examples passed; ${intentionalErrors.length} intentional error verified separately.`);
