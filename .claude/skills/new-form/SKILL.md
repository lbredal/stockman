---
description: Scaffold a create/edit form component for a Stockman entity. Use when adding UI to create or update a Product, Batch, Category, or Unit.
---

Scaffold a create/edit form for an entity.

## Ask first
If not provided, ask for:
1. Entity name (e.g. `Batch`)
2. Fields to include and their input types
3. Create-only, edit-only, or combined (same form for both)

## Steps

### 1. Create `src/components/<Entity>Form.jsx`
```jsx
import { useState } from 'react'

export function BatchForm({ initial = {}, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    productId: initial.productId ?? '',
    quantity: initial.quantity ?? '',
    unitId: initial.unitId ?? '',
    status: initial.status ?? 'available',
    harvestDate: initial.harvestDate ?? '',
    expiryDate: initial.expiryDate ?? '',
  })
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    setValues(v => ({ ...v, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(values)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* fields here */}
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save'}
      </button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  )
}
```

### 2. Mobile-friendly field guidelines
- Use `type="number" inputMode="decimal"` for quantities
- Use `type="date"` for harvest/expiry dates
- Use `<select>` for status, category, and unit (not free-text)
- Minimum touch target height: 44px for inputs and buttons

### 3. Connect to the page
The page calls the API; the form only calls `onSubmit(values)`:
```jsx
async function handleCreate(values) {
  await fetch('/api/batches', { method: 'POST', body: JSON.stringify(values), headers: { 'Content-Type': 'application/json' } })
  // refresh list
}
```

## Notes
- Form handles its own loading and error state
- Parent page handles API calls and list refresh
- Use `initial` prop to pre-populate for edit mode
