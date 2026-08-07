const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { getAuditFileNames, getLineEnding, expandBraces } = require('../src/lib/file');

function makeProject(files = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ta-files-'));
  for (const [name, content] of Object.entries(files)) {
    const target = path.join(dir, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
  return dir;
}

test('returns only files that match filesToAudit', async () => {
  const dir = makeProject({
    'src/a.tsx': '',
    'src/b.js': '',
    'src/c.css': '',
    'README.md': '',
  });

  const config = { filesToAudit: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'] };
  const files = await getAuditFileNames({ baseDir: dir, config });

  assert.deepStrictEqual(files.sort(), ['src/a.tsx', 'src/b.js'].sort());
});

test('returns all files when no filesToAudit patterns are configured', async () => {
  const dir = makeProject({ 'src/a.tsx': '', 'src/b.css': '' });

  const files = await getAuditFileNames({ baseDir: dir, config: {} });
  assert.deepStrictEqual(files.sort(), ['src/a.tsx', 'src/b.css'].sort());
});

test('applies .gitignore and .eslintignore rules', async () => {
  const dir = makeProject({
    'src/a.tsx': '',
    'src/b.tsx': '',
    'src/build/c.tsx': '',
    '.gitignore': '**/build/**\n',
    '.eslintignore': 'src/b.tsx\n',
  });

  const config = { filesToAudit: ['**/*.tsx'] };
  const files = await getAuditFileNames({ baseDir: dir, config });
  assert.deepStrictEqual(files, ['src/a.tsx']);
});

test('excludes node_modules and .git even when not listed', async () => {
  const dir = makeProject({
    'src/a.tsx': '',
    'node_modules/pkg/x.tsx': '',
    '.git/HEAD': '',
  });

  const files = await getAuditFileNames({ baseDir: dir, config: { filesToAudit: ['**/*.tsx'] } });
  assert.deepStrictEqual(files, ['src/a.tsx']);
});

test('expandBraces expands a single extension group', () => {
  assert.deepStrictEqual(expandBraces('**/*.{js,jsx}'), ['**/*.js', '**/*.jsx']);
});

test('expandBraces expands multiple groups as a cartesian product', () => {
  assert.deepStrictEqual(expandBraces('{a,b}-{1,2}'), ['a-1', 'a-2', 'b-1', 'b-2']);
});

test('expandBraces leaves patterns without braces unchanged', () => {
  assert.deepStrictEqual(expandBraces('**/*.js'), ['**/*.js']);
});

test('filesToAudit accepts brace-expanded patterns', async () => {
  const dir = makeProject({
    'src/a.js': '',
    'src/b.tsx': '',
    'src/c.css': '',
  });

  const config = { filesToAudit: ['**/*.{js,tsx}'] };
  const files = await getAuditFileNames({ baseDir: dir, config });
  assert.deepStrictEqual(files.sort(), ['src/a.js', 'src/b.tsx'].sort());
});

test('getLineEnding detects LF', () => {
  assert.strictEqual(getLineEnding('a\nb\n'), '\n');
});

test('getLineEnding detects CRLF', () => {
  assert.strictEqual(getLineEnding('a\r\nb\r\n'), '\r\n');
});
