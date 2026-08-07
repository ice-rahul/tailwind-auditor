const test = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CLI = path.join(__dirname, '..', 'bin', 'index.js');
const FIXTURE_DIR = path.join(__dirname, '..', 'tests');
const REPORT_NAME = `.audit-report-${process.pid}.tmp.txt`;
const REPORT_PATH = path.join(FIXTURE_DIR, REPORT_NAME);

test.after(() => {
  try {
    fs.unlinkSync(REPORT_PATH);
  } catch {
    // Report file may not exist if the test failed early — nothing to clean.
  }
});

test('CLI audits the fixture, prints findings, and writes a report file', () => {
  const result = spawnSync(process.execPath, [CLI, '-a', '-r', REPORT_NAME], {
    cwd: FIXTURE_DIR,
    encoding: 'utf8',
  });

  assert.strictEqual(result.status, 0, result.stderr || result.stdout);

  // Violations are reported with the expected shape.
  assert.match(result.stdout, /src\/pages\/index\.tsx:\d+\s+\d+\/4 inline classes:/);
  assert.match(result.stdout, /violation\(s\)/);

  // The text report is written with a header and the same findings.
  assert.ok(fs.existsSync(REPORT_PATH), 'report file should exist');
  const report = fs.readFileSync(REPORT_PATH, 'utf8');
  assert.match(report, /Tailwind Auditor Report/);
  assert.match(report, /src\/pages\/index\.tsx:9\s+6\/4 inline classes:/);
});

test('CLI without -a or a command prints usage help', () => {
  const result = spawnSync(process.execPath, [CLI], { encoding: 'utf8' });
  assert.strictEqual(result.status, 0);
  assert.match(result.stdout, /Usage: tailwind-auditor/);
  assert.match(result.stdout, /-a, --audit/);
});

test('CLI -v prints the package version', () => {
  const pkg = require('../package.json');
  const result = spawnSync(process.execPath, [CLI, '-v'], { encoding: 'utf8' });
  assert.strictEqual(result.status, 0);
  assert.match(result.stdout, new RegExp(`Your CLI Tool v${pkg.version}`));
});
