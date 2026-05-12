---
description: Find unused files, exports, and variables in the Stockman codebase. Use before a release or after a large refactor.
---

Find dead code in the Stockman codebase.

## Steps

### 1. Check for unused npm dependencies
```bash
npx depcheck
```
List any packages in `package.json` that are not imported anywhere.

### 2. Find unused exports
```bash
npx ts-prune  # if TypeScript
# or
npx unimported
```
List any exported functions, components, or constants that are never imported.

### 3. Find unused variables and imports manually
Scan for:
- `import` statements where the imported name never appears in the file body
- Variables declared with `const`/`let` that are never read
- Functions defined but never called from any other file

### 4. Find unreachable routes
Check `server.js` and `src/routes/` — are all registered routes actually used by the frontend?

### 5. Find orphaned files
Look for files in `src/db/`, `src/controllers/`, `src/routes/`, and `src/components/` that are never imported.

## Report format
```
[UNUSED EXPORT]   src/controllers/productController.js — exportCsv (never imported)
[UNUSED IMPORT]   src/components/pages/BatchPage.jsx:3 — import { format } from 'date-fns'
[ORPHANED FILE]   src/db/oldSchema.js — not imported anywhere
```

## Notes
- Do not delete anything without confirming with the user
- Some exports may be intentionally public API — ask before removing
