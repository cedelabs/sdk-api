import { Request, Response, NextFunction } from 'express';
import { MetricsService } from '../services/metrics';

/**
 * Replace dynamic segments (e.g. IDs or UUIDs) in the route/path
 * with a generic placeholder.
 */
function normalizePath(path: string): string {
  return path
    .split('/')
    .map(segment => {
      if (/^\d+$/.test(segment)) {
        // Segment consists entirely of digits (e.g. an ID)
        return ':id';
      }
      if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(segment)) {
        // Segment is a UUID (version 4, for example)
        return ':id';
      }
      return segment;
    })
    .join('/');
}

/**
 * Build a canonical route name for metrics.
 * It tries to use the mounted router and matched route (if available)
 * and falls back to the original URL.
 */
function getCanonicalRoute(req: Request): string {
  let routePath = '';

  // Try combining baseUrl and route.path if available
  if (req.baseUrl && req.route && req.route.path) {
    routePath = req.baseUrl + req.route.path;
  } else {
    // Fallback to originalUrl minus query string
    routePath = req.originalUrl.split('?')[0];
  }

  return normalizePath(routePath);
}

export function metricsMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const metrics = MetricsService.getInstance();
    const end = metrics.startMethodTimer();
    
    const method = getCanonicalRoute(req);

    const exchangeId =
      (req.headers['x-exchange-id'] as string) ||
      (req.query.exchangeId as string) ||
      (req.body && req.body.exchangeId) ||
      'unknown';
    const exchangeInstanceId =
      (req.headers['x-exchange-instance-id'] as string) ||
      (req.query.exchangeInstanceId as string) ||
      (req.body && req.body.exchangeInstanceId) ||
      'unknown';

    // Create response interceptor
    const originalSend = res.json;
    res.json = function(body) {
      if (res.statusCode >= 400) {
        metrics.recordMethodCall({method, exchangeId, exchangeInstanceId, status: 'error'});
      } else {
        metrics.recordMethodCall({method, exchangeId, exchangeInstanceId, status: 'success'});
      }
      
      end({ 
        method, 
        exchange_id: exchangeId, 
        exchange_instance_id: exchangeInstanceId 
      });
      
      return originalSend.call(this, body);
    };

    res.on('error', () => {
      metrics.recordMethodCall({method, exchangeId, exchangeInstanceId, status: 'error'});
      end({ 
        method, 
        exchange_id: exchangeId, 
        exchange_instance_id: exchangeInstanceId 
      });
    });

    next();
  };
} 