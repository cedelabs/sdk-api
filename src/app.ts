import bodyParser from "body-parser";
import express, { Express } from "express";
import * as OpenApiValidator from 'express-openapi-validator';
import path, { join } from "path";
import { setupRoutes } from "./routes";
import { healthRoutes } from './routes/health.controller';
import { SdkApiConfiguration } from "./types";
import { setupCedeSdk } from "./utils/sdk";

const __dirname = path.resolve();

export async function sdkApi(configuration: SdkApiConfiguration) {
  const sdk = await setupCedeSdk(configuration);
  const app: Express = express();
  const port = process.env.PORT || 3000;

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    startGracefulShutdown();
  });

  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    startGracefulShutdown();
  });

  function startGracefulShutdown() {
    console.log('Starting graceful shutdown...');
    
    server.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  }

  app.use('/api/v1/health', healthRoutes());
  
  app.use(bodyParser.json());
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
          message: "Authentication check failed. Please check the authentication middleware implementation",
          code: 500,
        });
      }
    });
  }

  app.use('/api/v1', setupRoutes(sdk));

  const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  process.on('SIGTERM', startGracefulShutdown);
  process.on('SIGINT', startGracefulShutdown);

  return app;
}