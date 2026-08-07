#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const packageJson = require('../package.json');
const fileContent = require('./defaultConfig.json');
const auditor = require('./audit');
const { CONFIG_FILE_NAME } = require('./constant');

const program = new Command();

program
  .name('tailwind-auditor')
  .description('CLI to audit tailwind in the project')
  .option('-v, --version', 'Show the version number')
  .option('-a, --audit', 'Audit the project for Tailwind best practices')
  .option('-r, --report <path>', 'Also write the audit findings to a text file');

program
  .command('init')
  .description('Initialize your project with a tailwind-auditor.json config')
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

// Handle global options when no sub-command is given.
program.action(() => {
  const options = program.opts();

  if (options.version) {
    console.log(`Your CLI Tool v${packageJson.version}`);
  }

  if (options.audit) {
    auditor({ reportPath: options.report }).catch((err) => {
      console.error('Audit failed:', err.message);
      process.exitCode = 1;
    });
  }

  // Display help if no valid command or option is provided.
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
});

program.parse();
