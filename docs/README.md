---
description: 'Tailwind Auditor: Why do we need tailwind auditor?'
---

# Introduction

### Why Tailwind Auditor

This tool will help you audit your files to follow best practices for tailwind CSS

The main inspiration of this project is to help developers to use tailwind CSS in an effective
manner. I have found developers curious to learn tailwind CSS but they end up writing messy code and
blaming tailwind that it clutters the code base. The general practice that is followed for tailwind
is to just start adding classNames to the component along with pseudo-classes like hover inline class
by class, which makes a long list of classNames in the component / HTML Element itself which makes it
hard to read.

By means of this tool, we are trying to guide the project to maintain better readability and
scalability (if tailwind is used in it).

### What it does

Tailwind Auditor scans your project and flags every element whose inline class count exceeds the
limit you set, so you always know where a `className` has grown too long to read. It also
pre-flights your project to confirm Tailwind is actually in use.

### Quick start

```bash
npm i tailwind-auditor --save-dev   # install
npx tailwind-auditor init           # create tailwind-auditor.json
npx tailwind-auditor -a             # run the audit
```

- [Installation](installation.md) — step-by-step install and setup.
- [Usage](usage.md) — the full CLI reference and output formats.
- [Configuration](configuration.md) — every option in `tailwind-auditor.json`.

### Sample output

```text
src/pages/index.tsx:12  23/4 inline classes: fixed left-0 top-0 flex w-full justify-center ...
11 violation(s) across 1 file(s).
```
