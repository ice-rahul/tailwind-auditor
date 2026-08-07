const { loadConfig, resolveConfigPath, defaultConfig } = require('./lib/config');
const { getAuditFileNames } = require('./lib/file');
const { extractClassAttributes, effectiveTokens } = require('./lib/classes');
const { auditFile, auditFiles, formatViolation } = require('./lib/audit');
const { checkTailwind } = require('./lib/preflight');
const { formatReport, writeReport } = require('./lib/report');

module.exports = {
  loadConfig,
  resolveConfigPath,
  defaultConfig,
  getAuditFileNames,
  extractClassAttributes,
  effectiveTokens,
  auditFile,
  auditFiles,
  formatViolation,
  formatReport,
  writeReport,
  checkTailwind,
};
