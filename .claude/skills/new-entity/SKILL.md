---
description: Scaffold all files for a new Stockman domain entity — db query file, controller, Express route, and React page stub. Use when adding a new entity like Product, Batch, Category, or Unit.
---

Scaffold a complete new domain entity for Stockman. Follow these steps exactly.

## Ask first
If the entity name is not provided, ask for:
1. Entity name (singular, PascalCase, e.g. `Product`)
2. Fields (name, type, nullable, and whether it belongs to a tenant directly or via a parent)

## Files to create

### 1. `src/db/<entity>.js`
Query helper functions using `pg` (no ORM). Always include:
- `getAll(tenantId)` — list all rows for a tenant
- `getById(id, tenantId)` — get one row, scoped to tenant
- `create(data)` — insert and return the new row
- `update(id, data, tenantId)` — update and return the row
- `remove(id, tenantId)` — delete scoped to tenant

Every query that reads or writes must filter by `tenant_id` directly or via a JOIN to the parent entity. Never query across tenants.

### 2. `src/controllers/<entity>Controller.js`
Business logic functions, one per operation. Each function:
- Receives validated input (not raw req/res)
- Calls db helpers from `src/db/<entity>.js`
- Returns data or throws an error

### 3. `src/routes/<entity>Routes.js`
Thin Express router. Each handler:
- Parses and validates input from `req`
- Calls the relevant controller function
- Returns JSON with appropriate HTTP status

Register the router in `server.js` under `/api/<entities>` (plural, kebab-case).

### 4. `src/components/pages/<Entity>Page.jsx`
Minimal React page stub:
- Fetches list from the API with `useEffect`
- Renders a simple list or table
- Includes a placeholder for a create form

## After creating files
- Remind the user to:
  1. Add a migration for the new table (`/new-migration`)
  2. Register the route in `server.js`
  3. Add the page to the React router
