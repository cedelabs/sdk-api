import bodyParser from "body-parser";
import express, { Express } from "express";
import * as OpenApiValidator from 'express-openapi-validator';
import path, { join } from "path";
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { setupRoutes } from "./routes";
import { healthRoutes } from './routes/health.controller';
import { SdkApiConfiguration } from "./types";
import { setupCedeSdk } from "./utils/sdk";
import { logger } from './services/logger';
import { metricsMiddleware } from './middleware/metricsMiddleware';
import { MetricsService } from './services/metrics';

const __dirname = path.resolve();

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

  app.use('/health', healthRoutes());
  
  app.use(bodyParser.json());

  if (process.env.MODE === "MOCK") {
    app.use((req, _res, next) => {
      req.headers['x-exchange-api-key'] = req.headers['x-exchange-api-key'] || 'demo-api-key';
      req.headers['x-exchange-api-secret'] = req.headers['x-exchange-api-secret'] || 'demo-secret-key';
      req.headers['x-exchange-api-password'] = req.headers['x-exchange-api-password'] || 'demo-password';
      req.headers['x-exchange-api-uid'] = req.headers['x-exchange-api-uid'] || 'demo-uid';
      next();
    });
  }

  app.use(
    OpenApiValidator.middleware({
      apiSpec: join(__dirname, '/dist/swagger.json'),
      validateRequests: true,
      validateResponses: true,
      ignorePaths: /^\/health/,
    }),
  );
  
  const auth = configuration.authentication;
  if (auth) {
    app.use(async (req, res, next) => {
      if (req.path.startsWith('/health')) {
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
    if (req.path.startsWith('/health') || req.path.startsWith('/metrics')) {
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