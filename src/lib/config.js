const fs = require('fs');
const path = require('path');

const defaultConfig = require('../../bin/defaultConfig.json');

function resolveConfigPath(baseDir = process.cwd(), configFileName = 'tailwind-auditor.json') {
  return path.resolve(baseDir, configFileName);
}

/**
 * Load the auditor config for a project.
 *
 * Reads `tailwind-auditor.json` from `baseDir` and merges it over the built-in
 * defaults. If the file is missing we fall back to the defaults instead of
 * throwing, so `-a` never crashes on a project that has not run `init` yet.
 *
 * @param {object} opts
 * @param {string} [opts.baseDir] Directory to look for the config in.
 * @param {string} [opts.configFileName] Override the config file name.
 * @returns {{ config: object, configPath: string, exists: boolean }}
 */
function loadConfig({ baseDir = process.cwd(), configFileName = 'tailwind-auditor.json' } = {}) {
  const configPath = resolveConfigPath(baseDir, configFileName);

  if (!fs.existsSync(configPath)) {
    return { config: { ...defaultConfig }, configPath, exists: false };
  }

  let raw;
  try {
    raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    throw new Error(`Invalid JSON in ${configPath}: ${err.message}`);
  }

  const config = {
    ...defaultConfig,
    ...raw,
    filesToAudit: Array.isArray(raw.filesToAudit) ? raw.filesToAudit : defaultConfig.filesToAudit,
    ignoredClasses: Array.isArray(raw.ignoredClasses)
      ? raw.ignoredClasses
      : defaultConfig.ignoredClasses,
  };

  return { config, configPath, exists: true };
}

module.exports = { loadConfig, resolveConfigPath, defaultConfig };
