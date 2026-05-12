---
description: Stop the local Stockman Postgres database Docker container.
disable-model-invocation: true
---

Stop the local Postgres database.

## Steps

### Stop but keep data
```bash
docker compose stop
```
The data volume is preserved. Run `docker compose up -d` to restart.

### Stop and remove containers (keep data volume)
```bash
docker compose down
```

### Stop and wipe all data (full reset)
```bash
docker compose down -v
```
⚠️ This deletes the `postgres_data` volume — all local data is lost. Use only to reset to a clean state.

## After a full reset
Re-run migrations and optionally seed:
```bash
node src/db/migrate.js
node src/db/seeds/seed.js
```
