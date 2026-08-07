const fs = require('fs');
const path = require('path');
const { extractClassAttributes, effectiveTokens } = require('./classes');

/**
 * Audit a single file and report the elements that exceed the allowed number
 * of inline classes.
 *
 * @param {string} filePath Absolute path, or path relative to `baseDir`.
 * @param {object} [config]
 * @param {number} [config.maxAllowedInlineClass]
 * @param {string[]} [config.ignoredClasses]
 * @param {string} [baseDir] Used to resolve `filePath` when it is relative.
 * @returns {{ file: string, violations: Array, error?: string }}
 */
function auditFile(filePath, config = {}, baseDir = process.cwd()) {
  const abs = path.isAbsolute(filePath) ? filePath : path.resolve(baseDir, filePath);
  const allowed = config.maxAllowedInlineClass ?? 4;
  const ignored = config.ignoredClasses || [];

  let source;
  try {
    source = fs.readFileSync(abs, 'utf8');
  } catch (err) {
    return { file: filePath, violations: [], error: err.message };
  }

  const violations = [];
  for (const { line, tokens } of extractClassAttributes(source)) {
    const counted = effectiveTokens(tokens, ignored);
    if (counted.length > allowed) {
      violations.push({ line, count: counted.length, allowed, tokens: counted });
    }
  }

  return { file: filePath, violations };
}

/**
 * Audit many files, returning only the ones that produced violations or errors.
 *
 * @param {string[]} files
 * @param {object} [config]
 * @param {string} [baseDir]
 * @returns {Array<{ file: string, violations: Array, error?: string }>}
 */
function auditFiles(files, config = {}, baseDir = process.cwd()) {
  return files
    .map((file) => auditFile(file, config, baseDir))
    .filter((result) => result.violations.length > 0 || result.error);
}

/**
 * One line of human-readable output for a single violation.
 *
 * @param {string} file
 * @param {{ line: number, count: number, allowed: number, tokens: string[] }} violation
 * @returns {string}
 */
function formatViolation(file, violation) {
  return `${file}:${violation.line}  ${violation.count}/${violation.allowed} inline classes: ${violation.tokens.join(' ')}`;
}

module.exports = { auditFile, auditFiles, formatViolation };
