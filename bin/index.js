#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const packageJson = require('../package.json');
const fileContent = require("./defaultConfig.json");
const auditor = require("./audit")
const { CONFIG_FILE_NAME } = require("./constant")

const program = new Command();

program
  .name('tailwind-auditor')
  .description('CLI to audit tailwind in the project')
  .option('-v, --version', 'Show the version number')
  .option('-a, --audit');

program
  .command('init')
  .description('Initialize your project')
  .action(() => {
    console.log('Initializing your project...');
    const jsonString = JSON.stringify(fileContent, null, 2);
    fs.writeFile(CONFIG_FILE_NAME, jsonString, (err) => {
      if (err) {
        console.error('Error creating the file:', err);
      } else {
        console.log('\nTailwind auditor initialized successfully\n');
        console.log(`You can configure the auditor by making changes to ${CONFIG_FILE_NAME}.\n`);
      }
    });
  });

// Add a default action to handle global options
program.action(() => {
  const options = program.opts();

  if (options.version) {
    console.log(`Your CLI Tool v${packageJson.version}`);
  }

  if (options.audit) {
    auditor();
  }

  // Display help if no valid command or option is provided
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
});

program.parse();
