# Usage

Tailwind Auditor is a CLI. It can initialize your config and run an audit, either on the terminal or
to a text report.

## Commands

| Command / Option          | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| `init`                    | Create a `tailwind-auditor.json` config file in the current folder. |
| `-a, --audit`             | Run the audit on the current project.                              |
| `-r, --report <path>`     | Also write the findings to a text file.                            |
| `-v, --version`           | Print the current version.                                         |
| `-h, --help`              | Show all commands and options.                                     |

## Initialize

```bash
npx tailwind-auditor init
```

Creates a `tailwind-auditor.json` file so you can tune the audit to your project. See
[Configuration](configuration.md). The audit also works without this file — it simply falls back to
the default settings.

## Audit

```bash
npx tailwind-auditor -a
```

Running the audit does three things:

1. **Pre-flight** — checks that the project uses Tailwind (looks for `tailwindcss` in
   `package.json` and for a `tailwind.config.{js,cjs,mjs,ts}` file). Missing pieces produce warnings,
   but the audit still runs.
2. **Discover files** — finds every file matching `filesToAudit`, respecting your `.gitignore` and
   `.eslintignore`, and always skipping `node_modules` and `.git`.
3. **Report violations** — prints one line per element whose inline class count exceeds
   `maxAllowedInlineClass`.

### Example output

```text
src/pages/index.tsx:12  23/4 inline classes: fixed left-0 top-0 flex w-full justify-center border-b ...
src/pages/index.tsx:36  29/4 inline classes: relative flex place-items-center before:absolute ...
11 violation(s) across 1 file(s).
```

Each line reads `file:line  count/max inline classes: <classes>`.

If nothing needs attention:

```text
Auditing 8 file(s)...

No issues found.
```

## Text report

Pass `--report` to also write the same findings to a file:

```bash
npx tailwind-auditor -a --report tailwind-audit-report.txt
```

Alternatively, set `reportFile` in `tailwind-auditor.json` and the report is written on every audit.
The report starts with a `Tailwind Auditor Report` header and ends with a summary line.

## Exit behaviour

The CLI exits `0` on success. If the audit itself throws (for example an unreadable config), it exits
with `1`.