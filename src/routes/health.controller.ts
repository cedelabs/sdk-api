import { Router } from 'express';
import { Controller, Get, Response, Route, Tags } from 'tsoa';
import { version as apiVersion } from '../../package.json';
import { version as sdkVersion } from '@cedelabs-private/sdk';
export const VERSION = `${apiVersion}+sdk${sdkVersion}`;

interface HealthResponse {
  status: 'ok';
  timestamp: string;
  version: string;
  apiVersion: string;
  sdkVersion: string;
}

@Route('health')
@Tags('Health')
export class HealthController extends Controller {
  /**
   * Service health check
   * @summary Get service health status
   */
  @Get('/')
  @Response<HealthResponse>(200, 'Service is healthy')
  public async getHealth(): Promise<HealthResponse> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: VERSION,
      apiVersion,
      sdkVersion,
    };
  }
}

export function healthRoutes() {
  const router = Router();
  const controller = new HealthController();

  router.get('/', (req, res) => {
    controller.getHealth()
      .then((response) => res.json(response))
      .catch(() => res.status(503).json({ 
        status: 'error',
        timestamp: new Date().toISOString(),
        version: VERSION,
        apiVersion,
        sdkVersion,
      }));
  });

  return router;
}