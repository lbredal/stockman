---
description: Review Stockman code for common performance anti-patterns. Use before merging a feature that adds new API calls, queries, or list rendering.
---

Review code for performance anti-patterns.

## Backend — what to look for

### N+1 queries
A loop that issues a separate DB query per item:
```js
// BAD
const products = await db.getAllProducts(tenantId)
for (const p of products) {
  p.batches = await db.getBatchesByProduct(p.id) // one query per product!
}

// GOOD — use a JOIN or a single WHERE IN query
```
Flag any `await` inside a `for`/`map`/`forEach` that calls a db function.

### Missing indexes
Any query with `WHERE`, `JOIN ON`, or `ORDER BY` on a column without an index on large tables. Use `/add-index` to fix.

### Returning too much data
- `SELECT *` when only a few columns are needed
- No pagination on list endpoints that could grow large (use `/paginate`)
- Fetching nested relations unnecessarily

## Frontend — what to look for

### Unnecessary re-renders
- State updates in `useEffect` that depend on objects/arrays (referential equality)
- Missing dependency arrays in `useEffect`
- Expensive calculations not wrapped in `useMemo`

### Fetch waterfalls
- Sequential `await fetch()` calls that could run in parallel with `Promise.all`
- Data fetched in child components that could be fetched once in the parent

### Large lists without virtualization
Lists with hundreds of items rendered all at once — consider pagination instead (use `/paginate`).

## Report format
List each issue with file, line, severity (high/medium/low), and suggested fix.
