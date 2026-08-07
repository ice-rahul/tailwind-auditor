const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { auditFile, auditFiles, formatViolation } = require('../src/lib/audit');

const FIXTURE = path.join(__dirname, '..', 'tests', 'src', 'pages', 'index.tsx');

const DEFAULT_CONFIG = {
  maxAllowedInlineClass: 4,
  ignoredClasses: [],
};

test('auditFile flags over-threshold elements in the fixture', () => {
  const result = auditFile(FIXTURE, DEFAULT_CONFIG);

  assert.strictEqual(result.error, undefined);
  assert.ok(result.violations.length > 0, 'expected at least one violation');

  const lines = result.violations.map((v) => v.line);
  // The <main> and the big <p> both exceed the allowed 4 classes.
  assert.ok(lines.includes(9), 'main element should be flagged');
  assert.ok(lines.includes(12), 'large paragraph should be flagged');

  for (const violation of result.violations) {
    assert.strictEqual(violation.count, violation.tokens.length);
    assert.ok(violation.count > violation.allowed);
  }
});

test('raising maxAllowedInlineClass above every count clears violations', () => {
  const result = auditFile(FIXTURE, { ...DEFAULT_CONFIG, maxAllowedInlineClass: 100 });
  assert.strictEqual(result.violations.length, 0);
});

test('ignoredClasses can bring a violation under the threshold', () => {
  // The <main> has 6 tokens; ignoring 3 that only appear on the <main> drops it to 3.
  const result = auditFile(FIXTURE, {
    maxAllowedInlineClass: 4,
    ignoredClasses: ['min-h-screen', 'flex-col', 'justify-between'],
  });
  assert.ok(!result.violations.some((v) => v.line === 9), 'main should no longer be flagged');
});

test('auditFiles returns only files with findings', () => {
  const findings = auditFiles([FIXTURE, path.join(__dirname, '..', 'README.md')], DEFAULT_CONFIG);
  assert.strictEqual(findings.length, 1);
  assert.strictEqual(findings[0].file, FIXTURE);
});

test('formatViolation produces file:line output with count/max and tokens', () => {
  const line = formatViolation('src/a.tsx', {
    line: 3,
    count: 6,
    allowed: 4,
    tokens: ['flex', 'p-4', 'a', 'b', 'c', 'd'],
  });
  assert.match(line, /^src\/a\.tsx:3\s+6\/4 inline classes:/);
  assert.ok(line.includes('flex'));
});

test('auditFile returns an error entry when the file cannot be read', () => {
  const result = auditFile(path.join(__dirname, '..', 'does-not-exist.tsx'), DEFAULT_CONFIG);
  assert.strictEqual(result.violations.length, 0);
  assert.ok(result.error);
});
