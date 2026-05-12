---
description: Create a new numbered Postgres migration file for Stockman. Use when adding or altering database tables or indexes.
---

Create a new Postgres migration file.

## Ask first
If not provided, ask for:
1. What the migration does (e.g. "create batches table", "add expiry_date to batches")

## Steps

### 1. Determine the next migration number
- List files in `src/db/migrations/`
- Find the highest existing number (e.g. `003`) and increment by one

### 2. Create `src/db/migrations/<NNN>_<slug>.sql`
- `NNN` is zero-padded to 3 digits (e.g. `004`)
- `slug` is a short snake_case description (e.g. `create_batches_table`)
- File contains both `-- up` and `-- down` sections

### 3. Template
```sql
-- up
-- TODO: write the up migration here

-- down
-- TODO: write the down migration here (reverses the up migration)
```

### 4. Fill in the migration
For new tables, always include:
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `tenant_id UUID NOT NULL REFERENCES tenants(id)`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`

For `down`, write the exact reverse of `up` (DROP TABLE, DROP COLUMN, etc.).

## After creating
Remind the user to run the migration against the database.
