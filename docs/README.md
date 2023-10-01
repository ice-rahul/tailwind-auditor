---
description: 'Tailwind Auditor: Why do we need tailwind auditor?'
---

# Introduction

### Why Tailwind Auditor

This tool will help you audit your files to follow best practices for tailwind CSS

The main inspiration of this project is to help developers to use tailwind CSS in an effective manner. I have found developers curious to learn tailwind CSS but they end up writing messy code and blaming tailwind that it clutters the code base. The general practice that is followed for tailwind is to just start adding classNames to the component along with pseudo-classes like hover inline class by class, which makes a long list of classNames in the component / HTML Element itself which makes it hard to read.

By means of this tool, we are trying to guide the project to maintain better readability and scalability (if tailwind is used in it).

### Initialization

We have architected it in such a way that you would be able to bend our rules to audit the files. As soon as you have initialized our package into your project you will find a file named as `tailwind-auditor.json`

```json
{
  "maxAllowedInlineClass": 4,
  "filesToAudit": [
    "**/*.js",
    "**/*.jsx",
    "**/*.ts",
    "**/*.tsx",
    "**/*.mdx"
  ]
}
```

### Auditing the files

For the MVP we will just be showing logs of the file and lines that need to be refactored. For the MVP we are going to show this in terminal logs only, we will provide a configuration parameter to generate a log file in coming future.

### maxAllowedInlineClass

Here we are defining the number of inline tailwind classes that are allowed for a component / HTML Element

### filesToAudit

This is an array of patterns that instructs the tool to consider the files to audit. We have even made the tool in such a way that it recognizes `.gitignore` and `.eslintignore` to ignore the files based on the configuration
