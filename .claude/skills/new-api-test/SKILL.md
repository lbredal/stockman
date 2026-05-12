---
description: Scaffold integration tests for a Stockman API endpoint. Tests hit a real test database — no mocks.
---

Scaffold integration tests for an API endpoint.

## Ask first
If not provided, ask for:
1. Entity and route to test (e.g. GET /api/batches)
2. Key scenarios to cover

## Setup assumptions
- Test framework: Vitest or Jest
- HTTP client: supertest
- Test database: a separate Postgres DB (set via `TEST_DATABASE_URL`)

## Steps

### 1. Create `src/routes/__tests__/<entity>Routes.test.js`
```js
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../../app.js'
import { pool } from '../../db/pool.js'

const TENANT_ID = 'test-tenant-uuid'

beforeEach(async () => {
  await pool.query('DELETE FROM batches WHERE tenant_id = $1', [TENANT_ID])
})

afterAll(async () => {
  await pool.end()
})

describe('GET /api/batches', () => {
  it('returns empty list when no batches', async () => {
    const res = await request(app)
      .get('/api/batches')
      .set('x-tenant-id', TENANT_ID)
    expect(res.status).toBe(200)
    expect(res.body).toEqual([])
  })

  it('returns only batches for the requesting tenant', async () => {
    // insert a batch for another tenant
    await pool.query('INSERT INTO batches (tenant_id, ...) VALUES ($1, ...)', ['other-tenant'])
    const res = await request(app)
      .get('/api/batches')
      .set('x-tenant-id', TENANT_ID)
    expect(res.body).toHaveLength(0) // other tenant's data must not appear
  })
})
```

### 2. Always include a tenant isolation test
Every list and single-resource endpoint must have a test verifying that data from another tenant is not returned.

### 3. Cover the happy path and key error cases
- 200/201 with valid data
- 400 with invalid input
- 404 when resource doesn't exist
- Tenant isolation (data from other tenant not visible)

## Notes
- Use a real test database, not mocks — see feedback memory
- Clean up test data in `beforeEach`, not `afterEach`
- Never hardcode production `DATABASE_URL` in tests
