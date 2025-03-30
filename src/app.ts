import { version as sdkVersion } from '@cedelabs-private/sdk';
import bodyParser from "body-parser";
import express, { Express } from "express";
import * as OpenApiValidator from 'express-openapi-validator';
import path, { join } from "path";
import { version as apiVersion } from '../package.json';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { metricsMiddleware } from './middleware/metricsMiddleware';
import { injectMockValues } from './mock';
import { setupRoutes } from "./routes";
import { logger } from './services/logger';
import { MetricsService } from './services/metrics';
import { SdkApiConfiguration } from "./types";
import { setupCedeSdk } from "./utils/sdk";

const __dirname = path.resolve();

export const VERSION = `${apiVersion}_sdk${sdkVersion}`;

export async function sdkApi(configuration: SdkApiConfiguration) {
  const sdk = await setupCedeSdk(configuration);
  const app: Express = express();
  const port = process.env.APP_PORT || 3000;

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    startGracefulShutdown();
  });

  process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    startGracefulShutdown();
  });

  function startGracefulShutdown() {
    logger.info('Starting graceful shutdown...');
    
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  }
  
  app.use(bodyParser.json());

  // Middleware to clean empty strings from query parameters
  app.use((req, _res, next) => {
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (req.query[key] === '') {
          delete req.query[key];
        }
      });
    }
    next();
  });

  if (process.env.MODE === "MOCK") {
    app.use((req, _res, next) => {
      logger.info(`Processing mock request: ${req.method} ${req.path}`);
      logger.info(`Query params before mock injection: ${JSON.stringify(req.query)}`);
      injectMockValues(req);
      logger.info(`Query params after mock injection: ${JSON.stringify(req.query)}`);
      next();
    });
  }

  app.use(
    OpenApiValidator.middleware({
      apiSpec: join(__dirname, '/dist/swagger.json'),
      validateRequests: true,
      validateResponses: true,
      ignorePaths: /^\/api\/v1\/health/,
    }),
  );
  
  const auth = configuration.authentication;
  if (auth) {
    app.use(async (req, res, next) => {
      if (req.path.startsWith('/api/v1/health')) {
        return next();
      }

      try {
        const isAuthenticated = await auth(req, res, next);
        if (isAuthenticated) {
          next();
        } else {
          res.status(401).json({
            name: "AuthenticationError",
            message: "Authentication failed, please provide a valid SECRET_API_KEY api key",
            code: 401,
          });
        }
      } catch (error) {
        res.status(500).json({
          name: "AuthenticationError",
          message: error instanceof Error ? error.message : "Authentication check failed",
          code: 500,
        });
      } 
    });
  }

  app.use((req, res, next) => {
    if (req.path.startsWith('/metrics')) {
      return next();
    }
    metricsMiddleware()(req, res, next);
  });

  app.use('/api/v1', setupRoutes(sdk));

  global.metricsService = MetricsService.getInstance();
  
  app.get('/metrics', async (_req, res) => {
    try {
      const metrics = await MetricsService.getInstance().getMetrics();
      res.set('Content-Type', 'text/plain');
      res.send(metrics);
    } catch (error) {
      res.status(500).send('Error collecting metrics');
    }
  }); 

  app.use(globalErrorHandler);

  const server = app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
  });

  process.on('SIGTERM', startGracefulShutdown);
  process.on('SIGINT', startGracefulShutdown);

  return app;
}