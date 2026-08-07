const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { checkTailwind } = require('../src/lib/preflight');

function makeProject(files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ta-preflight-'));
  for (const [name, content] of Object.entries(files)) {
    const target = path.join(dir, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return dir;
}

test('detects tailwind from package.json dependencies', () => {
  const dir = makeProject({
    'package.json': JSON.stringify({
      dependencies: { tailwindcss: '^3.4.0' },
      devDependencies: {},
    }),
  });
  assert.strictEqual(checkTailwind(dir).usingTailwind, true);
});

test('detects tailwind from devDependencies', () => {
  const dir = makeProject({
    'package.json': JSON.stringify({
      dependencies: {},
      devDependencies: { tailwindcss: '^4.0.0' },
    }),
  });
  assert.strictEqual(checkTailwind(dir).usingTailwind, true);
});

test('detects a tailwind config file', () => {
  const dir = makeProject({
    'package.json': JSON.stringify({ dependencies: {}, devDependencies: {} }),
    'tailwind.config.ts': 'export default {}',
  });
  const result = checkTailwind(dir);
  assert.strictEqual(result.tailwindConfigFile, 'tailwind.config.ts');
});

test('reports a note when tailwind or a config file is missing', () => {
  const dir = makeProject({
    'package.json': JSON.stringify({ dependencies: {}, devDependencies: {} }),
  });
  const result = checkTailwind(dir);
  assert.strictEqual(result.usingTailwind, false);
  assert.strictEqual(result.tailwindConfigFile, null);
  assert.ok(result.notes.length >= 2);
});

test('adds a note when there is no package.json at all', () => {
  const dir = makeProject({});
  const result = checkTailwind(dir);
  assert.strictEqual(result.usingTailwind, false);
  assert.ok(result.notes.some((note) => note.includes('No package.json')));
});
