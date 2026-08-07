const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const ignore = require('ignore');

// Folders that are never worth auditing regardless of the project's ignore files.
const ALWAYS_IGNORED = ['**/node_modules/**', '**/.git/**'];

/**
 * Read and parse the ignore rules from `.gitignore` and `.eslintignore` in a
 * project directory. Missing files are fine; blank lines and `#` comments are
 * skipped. Windows CRLF line endings are handled.
 *
 * @param {string} baseDir
 * @returns {string[]}
 */
function readIgnoreFiles(baseDir) {
  const patterns = [];

  ['.gitignore', '.eslintignore'].forEach((name) => {
    const ignoreFile = path.join(baseDir, name);
    try {
      const content = fs.readFileSync(ignoreFile, 'utf8');
      for (const line of content.split(getLineEnding(content))) {
        const trimmed = line.trim();
        if (trimmed !== '' && !trimmed.startsWith('#')) {
          patterns.push(trimmed);
        }
      }
    } catch {
      // Ignore file absent — nothing to add.
    }
  });

  return patterns;
}

/**
 * Detect the line ending used by a source string.
 *
 * @param {string} source
 * @returns {'\r\n' | '\n'}
 */
function getLineEnding(source) {
  const firstNewline = source.indexOf('\n');
  if (firstNewline > 0 && source[firstNewline - 1] === '\r') {
    return '\r\n';
  }
  return '\n';
}

/**
 * Expand brace groups in a glob pattern into the list of concrete patterns
 * they stand for. For example a js-or-jsx extension group produces one pattern
 * per option. Handles multiple groups as a cartesian product; nested braces are
 * not supported.
 *
 * @param {string} pattern
 * @returns {string[]}
 */
function expandBraces(pattern) {
  const open = pattern.indexOf('{');
  if (open === -1) return [pattern];

  const close = pattern.indexOf('}', open);
  if (close === -1) return [pattern];

  const head = pattern.slice(0, open);
  const options = pattern
    .slice(open + 1, close)
    .split(',')
    .map((option) => option.trim())
    .filter(Boolean);
  const tail = pattern.slice(close + 1);

  if (!options.length) return [pattern];

  const results = [];
  for (const option of options) {
    for (const expandedTail of expandBraces(tail)) {
      results.push(head + option + expandedTail);
    }
  }
  return results;
}

/**
 * Discover the files a project should be audited against.
 *
 * Returns every non-directory file under `baseDir` that is (a) not excluded by
 * `.gitignore` / `.eslintignore` / `node_modules` / `.git` and (b) matches at
 * least one `config.filesToAudit` pattern (or all files when no patterns are
 * set). Brace patterns with an extension group (for example js or jsx) are
 * supported.
 *
 * @param {object} opts
 * @param {string} [opts.baseDir]
 * @param {object} [opts.config]
 * @returns {Promise<string[]>} File paths relative to `baseDir`.
 */
async function getAuditFileNames({ baseDir = process.cwd(), config = {} } = {}) {
  const ignorePatterns = [...ALWAYS_IGNORED, ...readIgnoreFiles(baseDir)];

  const files = await fg(['**/*'], {
    cwd: baseDir,
    nodir: true,
    dot: false,
    ignore: ignorePatterns,
  });

  const auditPatterns =
    Array.isArray(config.filesToAudit) && config.filesToAudit.length ? config.filesToAudit : null;

  if (!auditPatterns) {
    return files;
  }

  const matcher = ignore();
  matcher.add(auditPatterns.flatMap(expandBraces));
  return files.filter((file) => matcher.ignores(file));
}

module.exports = { getAuditFileNames, getLineEnding, readIgnoreFiles, expandBraces };
