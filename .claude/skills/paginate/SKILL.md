---
description: Add limit/offset pagination to a Stockman list endpoint. Use when a list could grow large (batches, products) and should not return all rows at once.
---

Add pagination to a list endpoint.

## Ask first
If not provided, ask for the entity name (e.g. `Batch`).

## Steps

### 1. Update the db query in `src/db/<entity>.js`
```js
async function getAll(tenantId, { limit = 20, offset = 0 } = {}) {
  const { rows } = await pool.query(
    `SELECT * FROM <table>
     WHERE tenant_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [tenantId, limit, offset]
  )
  return rows
}

async function count(tenantId) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS total FROM <table> WHERE tenant_id = $1',
    [tenantId]
  )
  return rows[0].total
}
```

### 2. Update the controller in `src/controllers/<entity>Controller.js`
Return both the data and pagination metadata:
```js
async function getAll(tenantId, page = 1, limit = 20) {
  const offset = (page - 1) * limit
  const [items, total] = await Promise.all([
    db.getAll(tenantId, { limit, offset }),
    db.count(tenantId)
  ])
  return { items, total, page, limit, pages: Math.ceil(total / limit) }
}
```

### 3. Update the route in `src/routes/<entity>Routes.js`
```js
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = Math.min(parseInt(req.query.limit) || 20, 100)
  const result = await controller.getAll(req.tenantId, page, limit)
  res.json(result)
})
```

### 4. Update the React page
Add a simple next/previous control using the `pages` and `page` values from the response.

## Response shape
```json
{ "items": [...], "total": 42, "page": 1, "limit": 20, "pages": 3 }
```
