---
description: Scan Stockman code for queries missing tenant_id scoping. Run this before any PR that touches db or controller files.
---

Scan the codebase for tenant isolation gaps.

## Steps

### 1. Scan `src/db/` for unscoped queries
Look for any SQL query that:
- Reads from a tenant-scoped table without `WHERE tenant_id = $n`
- Joins to a tenant-scoped table without filtering by tenant
- Uses `SELECT *` or `SELECT count(*)` without a tenant filter

Flag each occurrence with the file, line number, and the missing filter.

### 2. Scan `src/controllers/` for missing tenant propagation
- Every controller function that reads or writes data must receive `tenantId` as a parameter
- `tenantId` must be passed to every db call — not hardcoded or omitted

### 3. Scan `src/routes/` for missing tenant extraction
- Every route that touches tenant-scoped data must extract `tenantId` from the request
- In v1 (no auth), this may come from a header or a middleware — verify it's consistent

### 4. Report
List every issue found in the format:
```
[CRITICAL] src/db/product.js:12 — SELECT missing tenant_id filter
[WARNING]  src/controllers/batchController.js:34 — tenantId not passed to db.update()
```

### 5. Fix
For each issue found, add the missing `tenant_id` filter or parameter, then re-run the scan.

## Notes
- Return 404 (not 403) when a resource exists but belongs to another tenant
- This check should be run before every PR that touches data access code
- `/test-tenant-isolation` adds runtime test coverage for the same concern
