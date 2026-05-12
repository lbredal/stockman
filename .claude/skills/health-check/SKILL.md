---
description: Verify that all Stockman services are running and reachable. Use when debugging a broken dev environment or after deployment.
---

Check that all Stockman services are healthy.

## Steps

### 1. Check Docker / Postgres
```bash
docker compose ps
```
The `db` service should show `running`. If not, run `/docker-up`.

### 2. Check the database connection
```bash
psql $DATABASE_URL -c "SELECT 1"
```
Expected: returns `1`. If it fails, check `DATABASE_URL` in `.env`.

### 3. Check the API server
```bash
curl http://localhost:3000/health
```
The API should expose a `/health` endpoint that returns `{ "status": "ok" }`.

If it doesn't exist yet, add it to `server.js`:
```js
app.get('/health', (req, res) => res.json({ status: 'ok' }))
```

### 4. Check the frontend dev server
Open `http://localhost:5173` in a browser. The React app should load without errors.

### 5. Check the API is reachable from the frontend
Open the browser dev tools network tab and verify that API calls to `/api/*` return 200, not connection errors.

## Report
List each check with a pass/fail status and any error messages found.
