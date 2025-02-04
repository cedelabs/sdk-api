import { Request } from 'express';
import { AuthParams } from './typeUtils';
/**
 * Extracts authentication parameters from request headers
 * Headers are expected to be prefixed with 'x-'
 */
export function extractAuthFromHeaders(req: Request): AuthParams {
  const auth: AuthParams = {
    exchangeInstanceId: req.headers['x-exchange-instance-id'] as string,
    exchangeId: req.headers['x-exchange-id'] as string,
    apiKey: req.headers['x-exchange-api-key'] as string,
    secretKey: req.headers['x-exchange-api-secret'] as string,
  };

  if (req.headers['x-exchange-api-password']) {
    auth.password = req.headers['x-exchange-api-password'] as string;
  }
  
  if (req.headers['x-exchange-api-uid']) {
    auth.uid = req.headers['x-exchange-api-uid'] as string;
  }

  if (!auth.apiKey || !auth.secretKey) {
    throw new Error('Missing required authentication headers');
  }

  return auth;
} 