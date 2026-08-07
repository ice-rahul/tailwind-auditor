const fs = require('fs');
const path = require('path');
const { formatViolation } = require('./audit');

/**
 * Render the full findings into a plain-text report.
 *
 * @param {Array<{ file: string, violations: Array, error?: string }>} findings
 * @returns {string}
 */
function formatReport(findings) {
  const lines = [];
  const header = 'Tailwind Auditor Report';
  lines.push(header);
  lines.push('='.repeat(header.length));
  lines.push('');

  if (!findings.length) {
    lines.push('No issues found.');
    return lines.join('\n');
  }

  for (const finding of findings) {
    if (finding.error) {
      lines.push(`ERROR reading ${finding.file}: ${finding.error}`);
      continue;
    }
    for (const violation of finding.violations) {
      lines.push(formatViolation(finding.file, violation));
    }
  }

  const totalViolations = findings.reduce((sum, finding) => sum + finding.violations.length, 0);
  lines.push('');
  lines.push(`${totalViolations} violation(s) across ${findings.length} file(s).`);

  return lines.join('\n');
}

/**
 * Write the findings to a text file, creating parent directories as needed.
 *
 * @param {Array} findings
 * @param {string} reportPath
 * @returns {string} The resolved path that was written.
 */
function writeReport(findings, reportPath) {
  const resolved = path.resolve(reportPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, formatReport(findings), 'utf8');
  return resolved;
}

module.exports = { formatReport, writeReport };
