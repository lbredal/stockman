---
description: Step-by-step guide to set up a fresh Stockman development environment from scratch.
---

Set up a fresh Stockman development environment.

## Prerequisites
- Node.js 20+
- Docker Desktop (for local Postgres)
- Git

## Steps

### 1. Clone the repo
```bash
git clone https://github.com/lbredal/stockman.git
cd stockman
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start Postgres via Docker
```bash
docker compose up -d
```
This starts a Postgres instance on port 5432. See `docker-compose.yml` for credentials.

### 4. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and fill in:
- `DATABASE_URL` — should match the Docker Postgres (e.g. `postgres://stockman:stockman@localhost:5432/stockman`)
- `PORT` — default 3000

### 5. Run migrations
```bash
node src/db/migrate.js
```

### 6. Seed the database (optional)
```bash
node src/db/seeds/seed.js
```

### 7. Start the development servers
In two terminals (or use a tool like `concurrently`):
```bash
# Terminal 1 — Express API
npm run dev:server

# Terminal 2 — Vite + React
npm run dev:client
```

The app should be available at `http://localhost:5173`.

## Troubleshooting
- **Postgres connection refused** — check Docker is running: `docker ps`
- **Port in use** — change `PORT` in `.env`
- **Migration errors** — check `DATABASE_URL` matches your Docker setup
