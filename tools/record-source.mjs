import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const walk = directory => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`]);
const paths = ['src', 'tests', 'tools'].flatMap(walk).concat(['index.html', 'package.json', 'package-lock.json', 'vite.config.ts', 'tsconfig.json', 'playwright.config.ts', 'eslint.config.js']).sort();
const files = Object.fromEntries(paths.map(path => [path, createHash('sha256').update(readFileSync(path)).digest('hex')]));
writeFileSync('docs/evidence/source-manifest.json', JSON.stringify({ recordedAt: new Date().toISOString(), node: process.version, platform: process.platform, files }, null, 2) + '\n');
console.log(`Recorded ${paths.length} source/config/test files.`);
