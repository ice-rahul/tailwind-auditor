# Configuration

The auditor reads a `tailwind-auditor.json` file from the project root. Run
`npx tailwind-auditor init` to generate it. Every option has a sensible default, so an empty or
missing file just means the defaults are used.

## Full example

```json
{
  "maxAllowedInlineClass": 4,
  "filesToAudit": ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.mdx"],
  "ignoredClasses": [],
  "reportFile": ""
}
```

## Options

| Option                  | Type       | Default                                                        | Description                                                                        |
| ----------------------- | ---------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `maxAllowedInlineClass` | `number`   | `4`                                                            | Maximum inline Tailwind classes allowed on a single element. Elements over this are flagged. |
| `filesToAudit`          | `string[]` | `["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.mdx"]`   | Glob patterns of the files to audit.                                               |
| `ignoredClasses`        | `string[]` | `[]`                                                           | Exact class names that never count toward the limit (e.g. custom/brand classes).   |
| `reportFile`            | `string`   | `""`                                                           | When set, the findings are also written to this text file. Empty means console only. |

### maxAllowedInlineClass

Controls how many inline classes are acceptable on one element before it is flagged.

```json
{
  "maxAllowedInlineClass": 6
}
```

### filesToAudit

Which files to scan. Patterns use glob syntax (one per entry):

```json
{
  "filesToAudit": ["**/*.jsx", "**/*.tsx", "!**/stories/**"]
}
```

The audit also honors your project's `.gitignore` and `.eslintignore`, and always excludes
`node_modules` and `.git` regardless of these patterns.

### ignoredClasses

Exact class names that should be removed from the count before comparing against the limit. Useful
for custom or brand-specific classes that are not Tailwind utilities:

```json
{
  "ignoredClasses": ["brand-button", "inter"]
}
```

> Note: only exact matches are excluded. Variants like `hover:brand-button` are not.

### reportFile

A path to write the text report to on every audit:

```json
{
  "reportFile": "tailwind-audit-report.txt"
}
```

Leave it as `""` to print to the terminal only. You can also override this per run with
`npx tailwind-auditor -a --report <path>`.

## Where the file lives

`tailwind-auditor.json` is read from the current working directory. That means you run the audit from
your project root:

```bash
cd my-project
npx tailwind-auditor -a
```
