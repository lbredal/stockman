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
