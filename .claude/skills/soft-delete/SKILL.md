---
description: Add soft-delete pattern to a Stockman entity. Adds a deleted_at column and filters it from all queries instead of permanently deleting rows.
---

Add soft-delete to an existing entity.

## Ask first
If not provided, ask for the entity name (e.g. `Product`).

## Steps

### 1. Create a migration
Use `/new-migration`. Add a `deleted_at` column:
```sql
-- up
ALTER TABLE <table> ADD COLUMN deleted_at TIMESTAMPTZ;

-- down
ALTER TABLE <table> DROP COLUMN deleted_at;
```

### 2. Update `src/db/<entity>.js`
- Add `WHERE deleted_at IS NULL` to ALL read queries (`getAll`, `getById`, any custom queries)
- Replace the `remove` function body with a soft delete:
```js
async function remove(id, tenantId) {
  const { rows } = await pool.query(
    'UPDATE <table> SET deleted_at = now() WHERE id = $1 AND tenant_id = $2 RETURNING *',
    [id, tenantId]
  )
  return rows[0]
}
```

### 3. Add a `restore` function (optional but recommended)
```js
async function restore(id, tenantId) {
  const { rows } = await pool.query(
    'UPDATE <table> SET deleted_at = NULL WHERE id = $1 AND tenant_id = $2 RETURNING *',
    [id, tenantId]
  )
  return rows[0]
}
```

### 4. Add index for performance
```sql
CREATE INDEX idx_<table>_deleted_at ON <table>(deleted_at) WHERE deleted_at IS NULL;
```

## Notes
- Never physically delete rows once soft-delete is in place
- Unique constraints may need to account for deleted rows (use partial unique indexes)
