import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

/**
 * Validation middleware factory
 * @param schema - Joi schema to validate against
 * @param property - Request property to validate ('body', 'params', 'query')
 */
export function validate(schema: Joi.ObjectSchema, property: 'body' | 'params' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors
      allowUnknown: false, // Don't allow extra fields
      stripUnknown: true // Remove unknown fields
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errorDetails,
        timestamp: new Date().toISOString()
      });
    }

    // Replace request property with validated/sanitized value
    req[property] = value;
    next();
  };
}

/**
 * Async validation wrapper for async validation logic
 */
export function asyncValidate(
  validationFn: (req: Request) => Promise<void>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validationFn(req);
      next();
    } catch (error: any) {
      res.status(400).json({
        error: 'Validation failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  };
}
