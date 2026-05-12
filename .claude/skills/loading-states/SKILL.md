---
description: Add loading, error, and empty states to a Stockman React page. Use before marking a page as done — all three states must be handled.
---

Add loading, error, and empty states to a page component.

## Ask first
If not provided, ask for the page/component name.

## The three states every data-fetching page needs

### 1. Loading state
Show while data is being fetched:
```jsx
if (loading) return <div className="loading">Loading...</div>
```
Or a skeleton placeholder that matches the shape of the content.

### 2. Error state
Show when the fetch fails:
```jsx
if (error) return (
  <div role="alert" className="error">
    <p>Could not load data. Please try again.</p>
    <button onClick={retry}>Retry</button>
  </div>
)
```

### 3. Empty state
Show when the fetch succeeds but returns no items:
```jsx
if (items.length === 0) return (
  <div className="empty">
    <p>No items yet.</p>
    <button onClick={openCreateForm}>Add your first one</button>
  </div>
)
```

## Full pattern
```jsx
export function BatchesPage() {
  const { batches, loading, error, retry } = useBatches()

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message="Could not load batches" onRetry={retry} />
  if (batches.length === 0) return <EmptyState message="No batches yet" actionLabel="Add batch" onAction={openForm} />

  return (
    <ul>
      {batches.map(b => <BatchCard key={b.id} batch={b} />)}
    </ul>
  )
}
```

## Notes
- Order: loading → error → empty → data. Never skip loading or error.
- Empty state should include a call to action (create the first item)
- Use reusable `<LoadingSpinner>`, `<ErrorMessage>`, `<EmptyState>` components (see `/new-component`)
