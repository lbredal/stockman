---
description: Add filtering and search query parameters to a Stockman list endpoint. Use when a list needs to be filterable by status, category, or text search.
---

Add filtering to a list endpoint.

## Ask first
If not provided, ask for:
1. Entity name
2. Which fields should be filterable (e.g. status, categoryId, name search)

## Steps

### 1. Update `src/db/<entity>.js` — build a dynamic WHERE clause
```js
async function getAll(tenantId, filters = {}) {
  const conditions = ['tenant_id = $1']
  const values = [tenantId]
  let i = 2

  if (filters.status) {
    conditions.push(`status = $${i++}`)
    values.push(filters.status)
  }
  if (filters.categoryId) {
    conditions.push(`category_id = $${i++}`)
    values.push(filters.categoryId)
  }
  if (filters.search) {
    conditions.push(`name ILIKE $${i++}`)
    values.push(`%${filters.search}%`)
  }

  const { rows } = await pool.query(
    `SELECT * FROM <table> WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
    values
  )
  return rows
}
```

### 2. Update the controller to pass filters through
```js
async function getAll(tenantId, filters) {
  return db.getAll(tenantId, filters)
}
```

### 3. Update the route to parse query params
```js
router.get('/', async (req, res) => {
  const filters = {
    status: req.query.status,
    categoryId: req.query.categoryId,
    search: req.query.search,
  }
  const items = await controller.getAll(req.tenantId, filters)
  res.json(items)
})
```

### 4. Update the React page
Add filter controls (dropdowns, search input) that update URL query params or local state, and re-fetch when they change.

## Notes
- Use `ILIKE` for case-insensitive text search in Postgres
- Never interpolate filter values directly into SQL — always use parameterized queries
- Combine with `/paginate` if the list could be large
