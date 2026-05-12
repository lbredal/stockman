---
description: Generate a markdown API reference from Stockman's Express routes. Use after adding new endpoints or before sharing the API with a frontend developer.
---

Generate API documentation from the Express routes.

## Steps

### 1. Read all route files in `src/routes/`
For each file, identify:
- The base path (from `server.js` registration)
- Each route: method, path, what it does
- Request body shape (from validator schemas in `src/validators/` if present)
- Response shape (from the controller return value)

### 2. Generate a markdown reference
Create or update `docs/api.md`:

```markdown
# Stockman API Reference

Base URL: `/api`

## Batches

### GET /api/batches
Returns all batches for the authenticated tenant.

**Query params**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status: available, reserved, sold |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20, max: 100) |

**Response 200**
\`\`\`json
{ "items": [...], "total": 42, "page": 1, "limit": 20, "pages": 3 }
\`\`\`

### POST /api/batches
...
```

### 3. Keep it current
Update `docs/api.md` whenever a route is added, changed, or removed.

## Notes
- Document only the public API surface (routes), not internal controller or db functions
- Include all query params, request body fields, and response shapes
- Note which fields are required vs optional
