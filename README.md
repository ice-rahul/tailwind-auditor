# Tailwind Auditor

Audit a project to highlight Tailwind CSS best practices and keep inline class lists readable.

Developers new to Tailwind tend to pile every utility — plus `hover:` / `dark:` / `lg:` variants —
straight onto a single element, producing long, hard-to-read `className` strings. Tailwind Auditor
scans your files and flags every element whose inline class count exceeds the limit you set, so you
know exactly where to refactor.

Only plain-text suggestions on the command line for now. A configuration to generate a log file is
provided via the `reportFile` option.

## Installation

Install as a dev dependency:

```bash
npm i tailwind-auditor --save-dev
```

## Usage

### Initialize

Create a `tailwind-auditor.json` config file in your project root:

```bash
npx tailwind-auditor init
```

### Audit

```bash
npx tailwind-auditor -a
```

This pre-flights the project (checks that `tailwindcss`, `postcss`, and `autoprefixer` are installed
and that a tailwind config file exists), discovers the files to audit, and
reports each element that exceeds `maxAllowedInlineClass`:

```
src/pages/index.tsx:12  23/4 inline classes: fixed left-0 top-0 flex w-full justify-center ...
11 violation(s) across 1 file(s).
```

To also write the findings to a text report:

```bash
npx tailwind-auditor -a --report tailwind-audit-report.txt
```

If no `tailwind-auditor.json` exists, the auditor falls back to its defaults and runs anyway (you can
still `init` to create one).

## Configuration

`npx tailwind-auditor init` creates a file like this:

```json
{
  "maxAllowedInlineClass": 4,
  "filesToAudit": ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.mdx"],
  "ignoredClasses": [],
  "reportFile": ""
}
```

| Option                  | Type     | Description                                                                           |
| ----------------------- | -------- | ------------------------------------------------------------------------------------- |
| `maxAllowedInlineClass` | `number` | Max inline classes allowed on a single element. Elements over this are flagged.        |
| `filesToAudit`          | `string[]` | Glob patterns of the files to audit.                                                 |
| `ignoredClasses`        | `string[]` | Class names that should never count (e.g. custom/brand classes).                     |
| `reportFile`            | `string` | When set, also writes the findings to this text file. Empty string means console-only. |

The auditor respects your project's `.gitignore` and `.eslintignore`, and always skips
`node_modules` and `.git`.

## Development

```bash
npm install
npm test        # node:test suite
npm run lint    # ESLint
npm run format  # Prettier
```

## Documentation

Full docs live at [Tailwind Auditor on GitBook](https://rahuls-organization-8.gitbook.io/tailwindauditor)
(source in `docs/`).

## Roadmap

- [x] Create an installable npm package
- [x] Create a script that can be run in the project
- [x] Check for `package.json` to ensure the project is using Tailwind
- [x] Check for Tailwind config files
- [x] Scan files for Tailwind class names
- [x] Provide audit suggestions in the CLI
- [x] Provide suggestions in a text file