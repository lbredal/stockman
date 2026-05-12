---
description: Add a Postgres index to a Stockman table. Use when a query is slow or when adding a foreign key, frequently-filtered column, or sort column.
---

Add a Postgres index for a column.

## Ask first
If not provided, ask for:
1. Table name
2. Column(s) to index
3. Why (slow query, FK, frequent filter, sort)

## When to add an index
- Every foreign key column (`tenant_id`, `product_id`, `category_id`, etc.) should be indexed
- Columns used in WHERE clauses frequently (e.g. `status`, `category_id`)
- Columns used in ORDER BY on large tables
- Unique constraints (use `UNIQUE INDEX`)

## Steps

### 1. Create a migration
Use `/new-migration` to create a new migration file.

### 2. Write the index SQL
```sql
-- up
CREATE INDEX idx_<table>_<column> ON <table>(<column>);

-- down
DROP INDEX IF EXISTS idx_<table>_<column>;
```

For composite indexes:
```sql
CREATE INDEX idx_<table>_<col1>_<col2> ON <table>(<col1>, <col2>);
```

For unique indexes:
```sql
CREATE UNIQUE INDEX idx_<table>_<column>_unique ON <table>(<column>);
```

### 3. Naming convention
`idx_<table>_<column(s)>` — e.g. `idx_batches_product_id`, `idx_products_tenant_id_category_id`

## Notes
- In Postgres, foreign keys do NOT automatically get indexes — add them manually
- `tenant_id` should be indexed on every table that has it
