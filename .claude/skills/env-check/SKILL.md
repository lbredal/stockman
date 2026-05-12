---
description: Verify that all required environment variables are set before the Stockman server starts. Use when adding a new env var or debugging a missing config issue.
---

Add or verify startup environment variable checks.

## Steps

### 1. Create or update `src/config.js`
```js
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'PORT',
  // add more as needed
]

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`)
    process.exit(1)
  }
}

export const config = {
  databaseUrl: process.env.DATABASE_URL,
  port: parseInt(process.env.PORT) || 3000,
}
```

### 2. Import config at the top of `server.js`
```js
import './config.js' // runs the check before anything else
```

### 3. Create or update `.env.example`
Add every required variable with a placeholder value (never real secrets):
```
DATABASE_URL=postgres://user:password@localhost:5432/stockman
PORT=3000
```

### 4. Verify `.env` is in `.gitignore`
```
.env
.env.local
```

## Notes
- `.env.example` should always be committed and kept up to date
- When adding a new env var, update both `config.js` and `.env.example`
- Never log the values of env vars — only log which ones are missing
