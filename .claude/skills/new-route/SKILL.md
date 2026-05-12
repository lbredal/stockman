---
description: Add a single REST endpoint to an existing Stockman entity. Use when you need to add one specific route (GET, POST, PUT, DELETE) without scaffolding the whole entity.
---

Add a single REST endpoint to an existing entity. Follow the thin-route pattern.

## Ask first
If not provided, ask for:
1. Entity name (e.g. `Batch`)
2. HTTP method (GET / POST / PUT / DELETE)
3. What it does (e.g. "mark a batch as sold")
4. Route path (e.g. `/:id/sell`)

## Steps

### 1. Add a controller function in `src/controllers/<entity>Controller.js`
- Name it clearly after the action (e.g. `markAsSold`)
- Receives plain arguments (id, tenantId, data) — not req/res
- Calls the relevant db helper
- Returns the result or throws a named error

### 2. Add a db helper if needed in `src/db/<entity>.js`
- Only add if the controller needs a new query
- Always scope queries to `tenant_id`

### 3. Add the route handler in `src/routes/<entity>Routes.js`
- Extract and validate input from `req`
- Call the controller function
- Return JSON with the correct HTTP status:
  - GET → 200
  - POST (create) → 201
  - PUT/PATCH → 200
  - DELETE → 204

## Conventions
- Routes are thin: no business logic, no SQL
- Always validate that the resource belongs to the requesting tenant before acting
- Use consistent error responses: `{ error: "message" }` with appropriate status codes
