---
description: Scaffold a new React context and provider for Stockman. Use when state needs to be shared across many components without prop drilling (e.g. current tenant, current user, toast notifications).
---

Scaffold a new React context and provider.

## Ask first
If not provided, ask for:
1. Context name (PascalCase, e.g. `TenantContext`)
2. What state it holds
3. Which components need access to it

## Steps

### 1. Create `src/context/<Name>Context.jsx`
```jsx
import { createContext, useContext, useState } from 'react'

const TenantContext = createContext(null)

export function TenantProvider({ children }) {
  const [tenant, setTenant] = useState(null)

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const ctx = useContext(TenantContext)
  if (!ctx) throw new Error('useTenant must be used inside TenantProvider')
  return ctx
}
```

### 2. Wrap the app in the provider in `src/main.jsx` or `src/App.jsx`
```jsx
<TenantProvider>
  <App />
</TenantProvider>
```

### 3. Use in components
```jsx
import { useTenant } from '../context/TenantContext'

const { tenant } = useTenant()
```

## Common Stockman contexts
- `TenantContext` — current tenant info
- `ToastContext` — global notification/toast messages
- `AuthContext` — current user (wire up with Supabase Auth in v2)

## Notes
- Always export a custom hook (`useTenant`) — never import the context directly
- Throw a clear error when the hook is used outside its provider
