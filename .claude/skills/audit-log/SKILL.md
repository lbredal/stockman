---
description: Add created_by and updated_by tracking to a Stockman entity. Records which user created or last modified a row.
---

Add audit tracking (`created_by`, `updated_by`) to an existing entity.

## Ask first
If not provided, ask for the entity name.

## Steps

### 1. Create a migration
```sql
-- up
ALTER TABLE <table>
  ADD COLUMN created_by UUID REFERENCES users(id),
  ADD COLUMN updated_by UUID REFERENCES users(id);

-- down
ALTER TABLE <table>
  DROP COLUMN created_by,
  DROP COLUMN updated_by;
```

### 2. Update `src/db/<entity>.js`
- `create`: accept `userId`, pass it as `created_by` and `updated_by`
- `update`: accept `userId`, pass it as `updated_by`

```js
async function create(data, userId) {
  const { rows } = await pool.query(
    `INSERT INTO <table> (..., created_by, updated_by)
     VALUES (..., $n, $n) RETURNING *`,
    [...values, userId, userId]
  )
  return rows[0]
}
```

### 3. Update controllers
Pass `userId` from the request context through to the db functions.

### 4. Update routes
Extract `userId` from `req.user.id` (or `req.tenantContext.userId` once auth is wired up).
For v1 (no auth), pass `null` as userId — the column is nullable.

## Notes
- Keep `created_by` immutable after creation — never update it
- This is distinct from `created_at` / `updated_at` which track time, not identity
