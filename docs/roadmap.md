# Roadmap

## MVP (done)

- [x] Create an installable npm package
- [x] Create a script that can be run in the project
- [x] Check for `package.json` to ensure the project is using Tailwind
- [x] Check for Tailwind config files
- [x] Scan files for Tailwind class names
- [x] Provide audit suggestions in the CLI
- [x] Provide suggestions in a text file

## Ideas for the future

- Validate classes against the project's actual Tailwind config (arbitrary values, theme extensions).
- Ignore files via comments (e.g. `// tailwind-auditor-ignore`) and inline suppression.
- HTML report with grouped findings per component.
- Configurable severity levels and rules beyond `maxAllowedInlineClass`.
- CI-friendly exit codes for failing audits (e.g. `--fail-on`).
