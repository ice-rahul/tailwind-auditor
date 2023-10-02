const path = require('path');
const fg = require('fast-glob');
const ignore = require('ignore');
const fs = require('fs');
const { CONFIG_FILE_NAME } = require("./constant")


async function getAuditFileNames() {
  let igCustom = ignore();

  // Read the config file
  const data = fs.readFileSync(CONFIG_FILE_NAME, 'utf8');
  const configData = JSON.parse(data);
  let ignorePatterns = []
  if (configData.filesToAudit) {
    igCustom.add(configData.filesToAudit);
  }

  try {
    ['./.gitignore', './.eslintignore'].forEach((ignorefile) => {
      const ignoreContent = fs.readFileSync(ignorefile, 'utf8');
      const parsedIgnoredContent = ignoreContent.split('\n').filter((line) => !line.startsWith('#') && line.trim() !== '');
      ignorePatterns = [...ignorePatterns, ...parsedIgnoredContent]
    })
  } catch (err) { }

  // Use fast glob to get a list of all file names in the folder
  const files = await fg(['./**/*'], { nodir: true, ignore: ignorePatterns });

  // Filter the list of files based on the .gitignore rules
  const result = files.filter((file) => {
    const relativePath = path.relative('.', file);
    if (configData.filesToAudit) {
      return igCustom.ignores(relativePath)
    }
    return file
  });

  return result
}

module.exports = getAuditFileNames;