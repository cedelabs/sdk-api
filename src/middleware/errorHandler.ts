import { Request, Response, NextFunction } from 'express';
import { CedeSDKError } from '@cedelabs-private/sdk';
import { processError } from '../utils/error';

export const errorHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      const { status, error: errorResponse } = processError(error as CedeSDKError);
      res.status(status).json(errorResponse);
    }
  };
};