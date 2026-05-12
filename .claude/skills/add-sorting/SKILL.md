---
description: Add sort-by and order query parameters to a Stockman list endpoint.
---

Add sorting to a list endpoint.

## Ask first
If not provided, ask for:
1. Entity name
2. Which columns are sortable (e.g. name, created_at, quantity)
3. Default sort column and direction

## Steps

### 1. Define an allowlist of sortable columns in `src/db/<entity>.js`
Never interpolate sort column names directly — use an allowlist to prevent SQL injection:
```js
const SORTABLE_COLUMNS = ['name', 'created_at', 'quantity']
const DEFAULT_SORT = 'created_at'
const DEFAULT_ORDER = 'DESC'

async function getAll(tenantId, { sortBy = DEFAULT_SORT, order = DEFAULT_ORDER } = {}) {
  const col = SORTABLE_COLUMNS.includes(sortBy) ? sortBy : DEFAULT_SORT
  const dir = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

  const { rows } = await pool.query(
    `SELECT * FROM <table> WHERE tenant_id = $1 ORDER BY ${col} ${dir}`,
    [tenantId]
  )
  return rows
}
```

### 2. Update the route to parse sort params
```js
router.get('/', async (req, res) => {
  const { sortBy, order } = req.query
  const items = await controller.getAll(req.tenantId, { sortBy, order })
  res.json(items)
})
```

### 3. Update the React page
Add sortable column headers that toggle ASC/DESC and update the query params.

## Notes
- Always use an allowlist for column names — never interpolate raw query string values into SQL
- Combine with `/paginate` and `/add-filter` for full list control
