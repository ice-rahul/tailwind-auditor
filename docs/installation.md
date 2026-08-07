# Installation

### Step 1

Install the package as a dev dependency in your project:

```
npm i tailwind-auditor --save-dev
```

### Step 2 (Optional)

Verify the installation by checking the version:

```
npx tailwind-auditor -v
```

This should give you a result saying

```
Your CLI Tool v1.1.0
```

### Step 3 (Optional)

Add a script to your project to initialize the package.

In your project's `package.json`, add a script:

```json
{
  ...
  "scripts": {
    ...,
    "tailwind-auditor": "npx tailwind-auditor init"
  },
  "devDependencies": {
    ...
    "tailwind-auditor": "^1.1.0"
  },
  ...
}
```

### Step 4

Initialize the project.

#### If you completed Step 3

```
npm run tailwind-auditor
```

#### If you skipped Step 3

```
npx tailwind-auditor init
```

Now, you should see a file generated with the name `tailwind-auditor.json` with the following values:

```json
{
  "maxAllowedInlineClass": 4,
  "filesToAudit": ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx", "**/*.mdx"],
  "ignoredClasses": [],
  "reportFile": ""
}
```

### Step 5

Audit the project:

```
npx tailwind-auditor -a
```

This checks that Tailwind is present, discovers the files to audit, and reports every element whose
class count exceeds `maxAllowedInlineClass`:

```
src/pages/index.tsx:12  23/4 inline classes: fixed left-0 top-0 flex w-full justify-center ...
11 violation(s) across 1 file(s).
```

To also write the findings to a text report:

```
npx tailwind-auditor -a --report tailwind-audit-report.txt
```