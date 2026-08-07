const fs = require('fs');
const path = require('path');

const TAILWIND_PACKAGE = 'tailwindcss';
const TAILWIND_CONFIG_NAMES = [
  'tailwind.config.js',
  'tailwind.config.cjs',
  'tailwind.config.mjs',
  'tailwind.config.ts',
];

/**
 * Best-effort read of a project's package.json.
 *
 * @param {string} baseDir
 * @returns {object | null}
 */
function readPackageJson(baseDir) {
  const packagePath = path.join(baseDir, 'package.json');
  if (!fs.existsSync(packagePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Check whether a project looks like a Tailwind project (roadmap items 1 & 2).
 *
 * Warns, but does not block, when Tailwind cannot be confirmed — a project may
 * still be worth auditing.
 *
 * @param {string} [baseDir]
 * @returns {{ usingTailwind: boolean, tailwindConfigFile: string | null, notes: string[] }}
 */
function checkTailwind(baseDir = process.cwd()) {
  const pkg = readPackageJson(baseDir);
  const deps = pkg ? { ...pkg.dependencies, ...pkg.devDependencies } : {};
  const usingTailwind = Object.prototype.hasOwnProperty.call(deps, TAILWIND_PACKAGE);

  const tailwindConfigFile =
    TAILWIND_CONFIG_NAMES.find((name) => fs.existsSync(path.join(baseDir, name))) || null;

  const notes = [];
  if (!pkg) {
    notes.push('No package.json found — could not verify the project uses Tailwind.');
  } else if (!usingTailwind) {
    notes.push('tailwindcss was not found in package.json dependencies/devDependencies.');
  }
  if (!tailwindConfigFile) {
    notes.push('No Tailwind config file (tailwind.config.{js,cjs,mjs,ts}) found.');
  }

  return { usingTailwind, tailwindConfigFile, notes };
}

module.exports = { checkTailwind, readPackageJson };
