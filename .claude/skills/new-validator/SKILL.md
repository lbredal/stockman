---
description: Add input validation to a Stockman Express route using zod. Use when adding or hardening a POST or PUT endpoint.
---

Add input validation to a route.

## Ask first
If not provided, ask for:
1. Entity and route (e.g. POST /api/batches)
2. Fields to validate and their types/constraints

## Steps

### 1. Install zod if not present
```bash
npm install zod
```

### 2. Create or update a schema file `src/validators/<entity>.js`
```js
import { z } from 'zod'

export const createBatchSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().positive(),
  unitId: z.string().uuid(),
  harvestDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional(),
  status: z.enum(['available', 'reserved', 'sold']).default('available'),
})

export const updateBatchSchema = createBatchSchema.partial()
```

### 3. Add a validation middleware helper `src/middleware/validate.js` (if not present)
```js
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten() })
    }
    req.validated = result.data
    next()
  }
}
```

### 4. Apply to the route
```js
import { validate } from '../middleware/validate.js'
import { createBatchSchema } from '../validators/batch.js'

router.post('/', validate(createBatchSchema), async (req, res) => {
  const batch = await controller.create(req.validated, req.tenantId)
  res.status(201).json(batch)
})
```

## Notes
- Use `req.validated` in the handler, not `req.body`, after validation
- Always validate UUIDs for id fields
- Partial schemas (`.partial()`) are good for PATCH/PUT
