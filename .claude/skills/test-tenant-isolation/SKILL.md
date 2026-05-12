---
description: Write tests that verify tenant data cannot leak across tenants in Stockman. Run this for every new entity and route to ensure multi-tenancy is correctly enforced.
---

Write tenant isolation tests for an entity.

## Ask first
If not provided, ask for the entity/route to test.

## The isolation invariants to test for every entity

### 1. List endpoint returns only own tenant's data
```js
it('does not return other tenants data in list', async () => {
  await insertBatch({ tenantId: 'tenant-A' })
  await insertBatch({ tenantId: 'tenant-B' })

  const res = await request(app).get('/api/batches').set('x-tenant-id', 'tenant-A')

  expect(res.body.every(b => b.tenantId === 'tenant-A')).toBe(true)
  expect(res.body).toHaveLength(1)
})
```

### 2. Get by ID returns 404 for another tenant's resource
```js
it('returns 404 when fetching another tenants resource by id', async () => {
  const { id } = await insertBatch({ tenantId: 'tenant-B' })

  const res = await request(app).get(`/api/batches/${id}`).set('x-tenant-id', 'tenant-A')

  expect(res.status).toBe(404)
})
```

### 3. Update is rejected for another tenant's resource
```js
it('cannot update another tenants resource', async () => {
  const { id } = await insertBatch({ tenantId: 'tenant-B' })

  const res = await request(app)
    .put(`/api/batches/${id}`)
    .set('x-tenant-id', 'tenant-A')
    .send({ status: 'sold' })

  expect(res.status).toBe(404) // 404, not 403 — do not reveal existence
})
```

### 4. Delete is rejected for another tenant's resource
Same pattern as update above.

## Notes
- Return 404 (not 403) when a resource exists but belongs to another tenant — do not reveal its existence
- These tests should exist for EVERY entity with tenant-scoped data
- Run `/tenant-safety-check` first to find any missing `tenant_id` scoping in the code
