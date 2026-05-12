---
description: Add a CSV export endpoint to a Stockman list resource. Use when users need to download inventory data as a spreadsheet.
---

Add a CSV export endpoint for a list resource.

## Ask first
If not provided, ask for:
1. Entity name
2. Which columns to include in the export
3. Whether to apply the same filters as the list endpoint

## Steps

### 1. Install `csv-stringify` if not present
```bash
npm install csv-stringify
```

### 2. Add export function to `src/controllers/<entity>Controller.js`
```js
import { stringify } from 'csv-stringify/sync'

async function exportCsv(tenantId, filters = {}) {
  const items = await db.getAll(tenantId, filters)
  const csv = stringify(items, {
    header: true,
    columns: {
      id: 'ID',
      name: 'Name',
      quantity: 'Quantity',
      status: 'Status',
      created_at: 'Created',
    },
  })
  return csv
}
```

### 3. Add the route in `src/routes/<entity>Routes.js`
```js
router.get('/export.csv', async (req, res) => {
  const csv = await controller.exportCsv(req.tenantId)
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="<entities>.csv"')
  res.send(csv)
})
```

### 4. Add a download button to the React page
```jsx
<a href="/api/<entities>/export.csv" download>Export CSV</a>
```

## Notes
- Place the export route before `/:id` routes to avoid route conflicts
- Format dates in a human-readable way (ISO or locale string)
- For large datasets, consider streaming the response
