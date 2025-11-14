import { Request, Response, NextFunction } from 'express';

/**
 * Custom error classes
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: any = undefined;

  // Handle known error types
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = error.message;
  } else if (error.message.includes('not found')) {
    statusCode = 404;
    message = error.message;
  }

  // Log error for debugging
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Send error response
  const errorResponse: any = {
    error: message,
    timestamp: new Date().toISOString(),
    path: req.url,
    method: req.method
  };

  if (details) {
    errorResponse.details = details;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString(),
    availableRoutes: [
      'GET /health',
      'GET /test-firestore',
      'POST /v1/contacts',
      'GET /v1/contacts/:id',
      'PATCH /v1/contacts/:id',
      'DELETE /v1/contacts/:id',
      'GET /v1/contacts/:id/matches'
    ]
  });
}
