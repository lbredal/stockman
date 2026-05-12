---
description: Insert realistic test data into the Stockman database for all entities. Use when setting up a dev or staging environment, or when you need data to test against.
---

Insert realistic seed data into the Stockman database for all entities.

## Steps

### 1. Check what entities exist
Look at `src/db/` to find all entity query files. Seed in dependency order:
1. tenants
2. units (depends on tenant)
3. categories (depends on tenant)
4. products (depends on category, tenant)
5. batches (depends on product)

### 2. Create `src/db/seeds/seed.js` if it doesn't exist
Use realistic Norwegian small-producer data:
- Tenant: "Hansens Gård"
- Categories: Grønnsaker, Kjøtt, Syltetøy, Meieri
- Units: kg, g, stk, liter, kurv, bunt, glass
- Products: Gulrøtter, Poteter, Lammekjøtt, Jordbærsyltetøy, Rømme
- Batches: 2-3 per product with varied quantities and statuses (available/reserved/sold)

### 3. Seed format
```js
// src/db/seeds/seed.js
import { pool } from '../pool.js'

async function seed() {
  // truncate in reverse order
  await pool.query('TRUNCATE batches, products, categories, units, users, tenants RESTART IDENTITY CASCADE')
  // insert data...
  await pool.end()
}

seed().catch(console.error)
```

### 4. Run the seed
```bash
node src/db/seeds/seed.js
```

## Notes
- Always truncate before seeding to avoid duplicates
- Seed data should cover all batch statuses: available, reserved, sold
- Include at least one product with no batches (to test empty states)
