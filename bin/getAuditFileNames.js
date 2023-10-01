const path = require('path');
const glob = require('glob');
const ignore = require('ignore');
const fs = require('fs');

let ig = ignore();
let igCustom = ignore();

const data = fs.readFileSync(CONFIG_FILE_NAME, 'utf8');
const configData = JSON.parse(data);
if (configData.filesToAudit) {
  igCustom.add(configData.filesToAudit);
}

try {
  const gitignoreContent = fs.readFileSync('./.gitignore', 'utf8');
  ig.add(gitignoreContent)
} catch (err) { }

try {
  const eslintignoreContent = fs.readFileSync('./.eslintignore', 'utf-8');
  ig.add(eslintignoreContent)
} catch (err) { }

function getAuditFileNames() {
  // Use glob to get a list of all file names in the folder
  const files = glob.sync(`./**/*`, { nodir: true });
  // Filter the list of files based on the .gitignore rules
  return files.filter((file) => {
    const relativePath = path.relative('.', file);
    if (configData.filesToAudit) {
      return !ig.ignores(relativePath) && igCustom.ignores(relativePath)
    }
    return !ig.ignores(relativePath)
  });
}

module.exports = getAuditFileNames;