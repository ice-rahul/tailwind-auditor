---
description: 'Tailwind Auditor: Why do we need tailwind auditor?'
---

# Introduction

This tool will help you audit your files to follow best practices for tailwind CSS

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
