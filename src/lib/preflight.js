const fs = require('fs');
const path = require('path');

// The packages a project should have installed to make full use of Tailwind.
const TAILWIND_PACKAGES = ['tailwindcss', 'postcss', 'autoprefixer'];
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
 * Verifies the presence of the expected packages (`tailwindcss`, `postcss`,
 * `autoprefixer`) and a Tailwind config file. Warns, but does not block, when
 * something is missing — a project may still be worth auditing.
 *
 * @param {string} [baseDir]
 * @returns {{
 *   packages: Record<string, boolean>,
 *   usingTailwind: boolean,
 *   tailwindConfigFile: string | null,
 *   notes: string[],
 * }}
 */
function checkTailwind(baseDir = process.cwd()) {
  const pkg = readPackageJson(baseDir);
  const deps = pkg ? { ...pkg.dependencies, ...pkg.devDependencies } : {};
  const notes = [];

  const packages = Object.fromEntries(
    TAILWIND_PACKAGES.map((name) => [name, Object.prototype.hasOwnProperty.call(deps, name)])
  );

  if (!pkg) {
    notes.push('No package.json found — could not verify the project uses Tailwind.');
  } else {
    for (const name of TAILWIND_PACKAGES) {
      if (!packages[name]) {
        notes.push(`${name} was not found in package.json dependencies/devDependencies.`);
      }
    }
  }

  const tailwindConfigFile =
    TAILWIND_CONFIG_NAMES.find((name) => fs.existsSync(path.join(baseDir, name))) || null;
  if (!tailwindConfigFile) {
    notes.push('No Tailwind config file (tailwind.config.{js,cjs,mjs,ts}) found.');
  }

  return { packages, usingTailwind: packages.tailwindcss, tailwindConfigFile, notes };
}

module.exports = { checkTailwind, readPackageJson };
