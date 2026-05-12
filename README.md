# Stockman

Lightweight inventory management for small producers of sellable goods (vegetables, meat, preserves, etc.). Mobile-first web app with multi-tenant support.

## Prerequisites

- Node.js 18+
- PostgreSQL

## Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/lbredal/stockman.git
   cd stockman
   npm install
   ```

2. Copy the example env file and fill in your database credentials:

   ```bash
   cp .env.example .env
   ```

3. Run database migrations:

   ```bash
   node src/db/migrate.js
   ```

## Development

Start the API server and Vite dev server together:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3000

## Testing

```bash
npm test
```

## Production

```bash
npm run build
npm start
```
