const {
  loadConfig,
  getAuditFileNames,
  auditFiles,
  formatViolation,
  writeReport,
  checkTailwind,
} = require('../src');

/**
 * Run the full audit for the current working directory: preflight Tailwind
 * checks, config loading, file discovery, analysis, console output, and an
 * optional text report.
 *
 * @param {object} opts
 * @param {string} [opts.reportPath] Override `config.reportFile`.
 * @returns {Promise<Array>} The findings produced (listed for the CLI caller).
 */
async function audit({ reportPath } = {}) {
  const { config, exists } = loadConfig();
  if (!exists) {
    console.log(
      `No tailwind-auditor.json found — using defaults. Run \`tailwind-auditor init\` to create one.\n`
    );
  }

  const preflight = checkTailwind(process.cwd());
  if (preflight.notes.length) {
    preflight.notes.forEach((note) => console.log(`WARN  ${note}`));
    console.log('');
  }

  const files = await getAuditFileNames({ baseDir: process.cwd(), config });
  console.log(`Auditing ${files.length} file(s)...\n`);

  const findings = auditFiles(files, config, process.cwd());

  if (!findings.length) {
    console.log('No issues found.');
  } else {
    for (const finding of findings) {
      if (finding.error) {
        console.log(`ERROR reading ${finding.file}: ${finding.error}`);
        continue;
      }
      for (const violation of finding.violations) {
        console.log(formatViolation(finding.file, violation));
      }
    }

    const total = findings.reduce((sum, finding) => sum + finding.violations.length, 0);
    console.log(`${total} violation(s) across ${findings.length} file(s).`);
  }

  const reportTarget = reportPath || config.reportFile;
  if (reportTarget) {
    const written = writeReport(findings, reportTarget);
    console.log(`Report written to ${written}`);
  }

  return findings;
}

module.exports = audit;
