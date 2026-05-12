---
description: Scaffold unit tests for a Stockman controller function. Use for testing business logic in isolation.
---

Scaffold unit tests for a controller function.

## Ask first
If not provided, ask for:
1. Controller file and function to test
2. Key scenarios to cover

## Steps

### 1. Create `src/controllers/__tests__/<entity>Controller.test.js`
```js
import { describe, it, expect, vi, beforeEach } from 'vitest'

// mock the db module
vi.mock('../../db/batch.js', () => ({
  getById: vi.fn(),
  update: vi.fn(),
}))

import * as db from '../../db/batch.js'
import { markAsSold } from '../batchController.js'

describe('markAsSold', () => {
  beforeEach(() => vi.clearAllMocks())

  it('updates status to sold', async () => {
    db.getById.mockResolvedValue({ id: '1', status: 'available', tenantId: 'tenant-1' })
    db.update.mockResolvedValue({ id: '1', status: 'sold' })

    const result = await markAsSold('1', 'tenant-1')

    expect(db.update).toHaveBeenCalledWith('1', { status: 'sold' }, 'tenant-1')
    expect(result.status).toBe('sold')
  })

  it('throws NotFoundError when batch does not exist', async () => {
    db.getById.mockResolvedValue(null)
    await expect(markAsSold('999', 'tenant-1')).rejects.toThrow('not found')
  })
})
```

### 2. What to unit test in controllers
- Status transition rules (e.g. can't mark a sold batch as reserved)
- Calculations (e.g. total value, remaining stock)
- Error conditions (not found, forbidden, invalid state)

### 3. What NOT to unit test in controllers
- SQL correctness — that belongs in integration tests
- HTTP parsing — that belongs in route tests

## Notes
- Mock the db layer in unit tests; use real db in integration tests
- Keep unit tests fast — no DB connections, no I/O
