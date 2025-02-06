import { NextFunction, Request, Response } from 'express';
import { ErrorResponse } from '../types';

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }
  
  // Default status is 500 if not provided
  const status = err.status || 500;

  const errorResponse: ErrorResponse = {
    name: err.name || 'InternalServerError',
    code: status,
    message: err.message || 'An unexpected error occurred',
    originalErrorMessage: err.errors ? JSON.stringify(err.errors) : undefined,
  };

  res.status(status).json(errorResponse);
} 