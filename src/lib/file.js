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
 * Discover the files a project should be audited against.
 *
 * Returns every non-directory file under `baseDir` that is (a) not excluded by
 * `.gitignore` / `.eslintignore` / `node_modules` / `.git` and (b) matches at
 * least one `config.filesToAudit` pattern (or all files when no patterns are set).
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
  matcher.add(auditPatterns);
  return files.filter((file) => matcher.ignores(file));
}

module.exports = { getAuditFileNames, getLineEnding, readIgnoreFiles };
