---
description: Add a named error class with consistent HTTP status mapping for Stockman. Use when you need structured error handling beyond generic 500s.
---

Add a named error class with HTTP status mapping.

## Steps

### 1. Create `src/errors.js` (if it doesn't exist)
```js
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403)
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400)
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409)
  }
}
```

### 2. Add a global error handler to `server.js`
```js
app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  const message = err.statusCode ? err.message : 'Internal server error'
  if (!err.statusCode) console.error(err)
  res.status(status).json({ error: message })
})
```

### 3. Use in controllers
```js
import { NotFoundError, ForbiddenError } from '../errors.js'

const item = await db.getById(id, tenantId)
if (!item) throw new NotFoundError('Batch')
```

## Notes
- Routes do not need try/catch when using an async wrapper — add one if not present
- Never leak internal error details (stack traces, SQL) to the client in production
