---
description: Review Stockman code for common security vulnerabilities. Run before any PR that touches routes, db queries, or user input handling.
---

Review code for security vulnerabilities relevant to the Stockman stack.

## What to check

### SQL injection
- All DB queries must use parameterized queries (`$1`, `$2`) — never string interpolation
- Sort column names must come from an allowlist (see `/add-sorting`)
- Flag any `pool.query(\`...${variable}...\`)` pattern immediately

### Tenant data leakage
- Every query on a tenant-scoped table must filter by `tenant_id`
- IDs from the URL must be validated against the requesting tenant before acting
- Run `/tenant-safety-check` as part of this review

### Missing input validation
- All POST/PUT route bodies must be validated before being passed to controllers
- UUIDs, enums, and required fields must be checked
- Use `/new-validator` to add zod validation where missing

### Sensitive data exposure
- No secrets, tokens, or passwords in logs or API responses
- Error responses must not leak stack traces or SQL in production
- `.env` must be in `.gitignore`

### HTTP security headers
Check that `server.js` uses `helmet`:
```js
import helmet from 'helmet'
app.use(helmet())
```

### CORS
- CORS should be restricted to known origins in production
- Do not use `origin: '*'` in production

### Rate limiting
- Consider `express-rate-limit` on mutation endpoints (POST, PUT, DELETE)

## Report format
```
[CRITICAL] src/db/product.js:22 — SQL injection: variable interpolated into query
[HIGH]     src/routes/batchRoutes.js:14 — no input validation on POST body
[MEDIUM]   server.js — helmet not installed
```
