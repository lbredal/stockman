---
description: Scaffold a new reusable React component for Stockman. Use when adding a UI element that will be shared across pages (e.g. StatusBadge, QuantityInput, EntityCard).
---

Scaffold a new reusable React component.

## Ask first
If not provided, ask for:
1. Component name (PascalCase, e.g. `StatusBadge`)
2. What it displays or does
3. What props it needs

## Steps

### 1. Create `src/components/<ComponentName>.jsx`
```jsx
export function ComponentName({ prop1, prop2 }) {
  return (
    <div>
      {/* component content */}
    </div>
  )
}
```

### 2. Keep components focused
- One component per file
- No API calls in reusable components — receive data via props
- No business logic — display only

### 3. Mobile-first styling
- Use relative units (rem, %, dvh) not fixed pixels
- Touch targets minimum 44px height
- Test at 390px width (iPhone 14 viewport)

## Common Stockman components to consider
- `StatusBadge` — colored pill for batch status (available / reserved / sold)
- `QuantityDisplay` — quantity + unit abbreviation
- `EntityCard` — mobile-friendly card for list items
- `EmptyState` — message when a list is empty
- `ErrorMessage` — styled error display
- `LoadingSpinner` — loading indicator

## Notes
- Export as named export, not default export
- Co-locate any component-specific CSS as `<ComponentName>.module.css` if needed
