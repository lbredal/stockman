---
description: Roll back the last applied Postgres migration for Stockman. Use when a migration has an error or needs to be undone.
---

Roll back the last applied migration.

## Steps

### 1. Find the last migration
List `src/db/migrations/` and identify the highest-numbered file (e.g. `004_add_expiry_to_batches.sql`).

### 2. Extract the `-- down` section
Read the migration file and find everything after the `-- down` comment.

### 3. Run the down SQL
Execute it against the database:
```bash
psql $DATABASE_URL -c "<down SQL here>"
```

Or if using a migration runner, use its rollback command.

### 4. Confirm
Run a quick query to verify the change was reversed (e.g. `\d <table>` to check columns, or `\dt` to check tables).

## Caution
- Never roll back in production without a backup
- If the `-- down` section is missing or incomplete, stop and ask the user before proceeding
- Rolling back a `CREATE TABLE` migration will drop all data in that table
