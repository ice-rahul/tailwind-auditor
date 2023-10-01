# Installation

### Step 1

Install the package as devDependencies to your project by the following command

```
npm i tailwind-auditor --save-dev
```

### Step 2 (Optional)

Testing the package, You can verify you have tailwind editor installed in your project by the following command

```
npx tailwind-auditor -v
```

This should give you a result saying

```
Your CLI Tool v1.0.2
```

### Step 3 (Optional)

Add the script to your project to initialize the package.

In order to do that, go to package.json of your project. You need to add the following script in your package.json

```json
{
  ...
  "scripts": {
    ...,
    "tailwind-auditor": "npx tailwind-auditor init"
  },
  "devDependencies": {
    ...
    "tailwind-auditor": X.X.X
  },
  ...
}
```

### Step 4

Now it's time to initialize the project. &#x20;

#### If you completed Step 3

```
npm run tailwind-auditor
```

#### If you skipped Step 3

```
npx tailwind-auditor init
```

Now, you should be able to see a file is generated with the name `tailwind-auditor.json` with the following values

```
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

### Step 5

Get the list of file that needs to be audited, Verify the filenames if they are correct and we are targetting the correct file

```
npx tailwind-auditor -a
```

should result into

```
Files to audit: src/testComponent.js
Files to audit: src/testComponent1.js
etc
```
