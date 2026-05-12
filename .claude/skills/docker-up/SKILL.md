---
description: Start the local Stockman Postgres database via Docker Compose.
disable-model-invocation: true
---

Start the local Postgres database.

## Steps

### 1. Check if Docker is running
```bash
docker info
```
If not running, start Docker Desktop first.

### 2. Start the database
```bash
docker compose up -d
```

### 3. Verify it's running
```bash
docker compose ps
```
The `db` service should show status `running`.

### 4. Test the connection
```bash
psql $DATABASE_URL -c "SELECT 1"
```
Or check via the app: `npm run dev:server` should connect without errors.

## If `docker-compose.yml` doesn't exist yet
Create it:
```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: stockman
      POSTGRES_PASSWORD: stockman
      POSTGRES_DB: stockman
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```
