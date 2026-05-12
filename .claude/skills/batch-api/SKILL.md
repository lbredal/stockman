---
description: Add bulk create, update, or delete endpoints to a Stockman entity. Use when users need to operate on multiple records at once.
---

Add bulk (batch) API endpoints to an entity.

## Ask first
If not provided, ask for:
1. Entity name
2. Which operations to bulk-enable: create / update / delete

## Steps

### Bulk create — `POST /api/<entities>/bulk`
```js
// db: insert multiple rows in one query
async function createMany(rows, tenantId) {
  // build parameterized multi-row INSERT
  const values = []
  const placeholders = rows.map((row, i) => {
    const base = i * <fieldCount>
    values.push(row.field1, row.field2, tenantId)
    return `($${base + 1}, $${base + 2}, $${base + 3})`
  })
  const { rows: inserted } = await pool.query(
    `INSERT INTO <table> (field1, field2, tenant_id) VALUES ${placeholders.join(', ')} RETURNING *`,
    values
  )
  return inserted
}
```

### Bulk update — `PUT /api/<entities>/bulk`
Accept `[{ id, ...fields }]`. Use a transaction:
```js
async function updateMany(updates, tenantId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const results = await Promise.all(
      updates.map(({ id, ...data }) => updateOne(client, id, data, tenantId))
    )
    await client.query('COMMIT')
    return results
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
```

### Bulk delete — `DELETE /api/<entities>/bulk`
Accept `{ ids: [...] }`. Always scope to tenantId:
```js
async function removeMany(ids, tenantId) {
  await pool.query(
    'DELETE FROM <table> WHERE id = ANY($1) AND tenant_id = $2',
    [ids, tenantId]
  )
}
```

## Route shape
- `POST /api/<entities>/bulk` → 201 with array of created items
- `PUT /api/<entities>/bulk` → 200 with array of updated items
- `DELETE /api/<entities>/bulk` → 204

## Notes
- Always wrap bulk writes in a transaction
- Validate that all IDs in bulk update/delete belong to the tenant before acting
- Cap bulk operations at a reasonable limit (e.g. 100 records) to prevent abuse
