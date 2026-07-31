import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outputDir = resolve(process.cwd(), '.output', 'server');
const sourceEntry = resolve(outputDir, 'index.mjs');
const aliasEntry = resolve(outputDir, 'server.js');

if (!existsSync(sourceEntry)) {
  console.error(`Expected build output not found: ${sourceEntry}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(
  aliasEntry,
  `export * from './index.mjs';\nexport { default } from './index.mjs';\n`,
  'utf-8',
);
console.log(`Created server alias: ${aliasEntry}`);
