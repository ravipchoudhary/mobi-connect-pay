import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outputDir = resolve(process.cwd(), '.output', 'server');
const sourceEntry = resolve(outputDir, 'index.mjs');
const aliasEntry = resolve(outputDir, 'server.js');
const outputPackageJson = resolve(process.cwd(), '.output', 'package.json');

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

// Ensure .output/package.json exists and contains "type": "module" so Node treats
// the generated server entry as an ES module and avoids the MODULE_TYPELESS_PACKAGE_JSON
// warning when starting the production server.
try {
  let pkg = { type: 'module' };
  if (existsSync(outputPackageJson)) {
    try {
      const raw = readFileSync(outputPackageJson, 'utf-8');
      const parsed = JSON.parse(raw || '{}');
      if (parsed.type !== 'module') {
        parsed.type = 'module';
        pkg = parsed;
      } else {
        pkg = parsed;
      }
    } catch {
      // fall back to writing minimal package.json
    }
  }
  writeFileSync(outputPackageJson, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
  console.log(`Ensured ${outputPackageJson} contains type: module`);
} catch (e) {
  // non-fatal
}
