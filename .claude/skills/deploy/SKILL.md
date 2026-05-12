---
description: Walk through deploying the Stockman app (API + database). Use when setting up a new environment or releasing a new version.
---

Deploy the Stockman application.

## Recommended hosting (cheap, small-producer scale)
- **API + frontend**: Railway or Render (free tier available)
- **Postgres**: Railway Postgres or Supabase (free tier available)

## Steps

### 1. Prepare the build
```bash
npm run build        # builds the Vite/React frontend to dist/
```
Verify `dist/` is created and not in `.gitignore`.

### 2. Ensure environment variables are set on the host
Required:
- `DATABASE_URL` — production Postgres connection string
- `PORT` — usually set automatically by the host
- `NODE_ENV=production`

### 3. Run migrations on production
```bash
DATABASE_URL=<prod-url> node src/db/migrate.js
```
Always run migrations before deploying new code, not after.

### 4. Deploy the app
For Railway/Render: push to the connected branch (usually `main`) and the host builds automatically.

For manual deploy:
```bash
git push origin main
```

### 5. Verify the deployment
- Check the host dashboard for build/deploy errors
- Run `/health-check` against the production URL
- Test a key flow end-to-end (create a batch, change its status)

## Before every deploy checklist
- [ ] Migrations written and tested locally
- [ ] `.env.example` is up to date
- [ ] No hardcoded dev URLs or credentials in code
- [ ] `npm audit` shows no critical vulnerabilities

## Notes
- Never deploy directly to production without testing migrations locally first
- Keep a backup of the production database before running destructive migrations
