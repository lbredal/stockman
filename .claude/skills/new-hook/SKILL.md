---
description: Scaffold a new custom React hook for Stockman. Use when API fetching logic or stateful behavior is repeated across multiple components.
---

Scaffold a new custom React hook.

## Ask first
If not provided, ask for:
1. Hook name (camelCase, prefixed with `use`, e.g. `useBatches`)
2. What it does (fetches data, manages form state, etc.)
3. What it should return

## Steps

### 1. Create `src/hooks/<hookName>.js`

For a data-fetching hook:
```js
import { useState, useEffect } from 'react'

export function useBatches(filters = {}) {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch('/api/batches?' + new URLSearchParams(filters))
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => { if (!cancelled) setBatches(data.items ?? data) })
      .catch(err => { if (!cancelled) setError(err) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [JSON.stringify(filters)])

  return { batches, loading, error }
}
```

### 2. Always handle cleanup
Use the `cancelled` flag pattern to avoid setting state on unmounted components.

### 3. Return consistent shape
- Data-fetching hooks: `{ data, loading, error }`
- Action hooks: `{ execute, loading, error }`

## Notes
- Keep hooks in `src/hooks/` — not inside component files
- One concern per hook (don't mix data fetching with form state)
- Hooks that share logic between pages are good candidates — single-use hooks are usually better inlined
