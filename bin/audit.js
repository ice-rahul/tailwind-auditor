const { CONFIG_FILE_NAME } = require("./constant")
const fs = require('fs');
const getFileNames = require('./getAuditFileNames')

async function audit() {
  try {
    // Read the file synchronously
    const data = fs.readFileSync(CONFIG_FILE_NAME, 'utf8');
    const configData = JSON.parse(data);

    // Print the list of file names
    const filteredFiles = await getFileNames()
    filteredFiles.forEach((file) => {
      // Files to audit
      console.log('Files to audit:', file);
    });

    // Process the file data
    // console.log('File contents:', configData);
  } catch (err) {
    console.error('Error reading the file:', err);
  }
}

module.exports = audit;