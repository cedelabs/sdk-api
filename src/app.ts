import express, { Express } from "express";
import bodyParser from "body-parser";
import { setupCedeSdk } from "./utils/sdk";
import { setupRoutes } from "./routes";
import { SdkApiConfiguration } from "./types";
import { processError } from "./utils/error";
import * as OpenApiValidator from 'express-openapi-validator';
import { join } from "path";
import path from "path";
const __dirname = path.resolve();
export async function sdkApi(configuration: SdkApiConfiguration) {
  const sdk = await setupCedeSdk(configuration);
  const app: Express = express();
  const port = process.env.PORT || 3222;
  app.use(bodyParser.json());
  app.use(
	OpenApiValidator.middleware({
	apiSpec: join(__dirname, '/dist/swagger.json'),
	validateRequests: true,
	  validateResponses: true,
	}),
  );

  app.use((err: any, req: any, res: any, next: any) => {
	res.status(err.status || 500).json({
	  message: err.message,
	  errors: err.errors,
	});
  });
  
  const auth = configuration.authentication;
  if (auth) {
    app.use(async (req, res, next) => {
      try {
        const isAuthenticated = await auth(req, res, next);
        if (isAuthenticated) {
          next();
        } else {
          res.status(401).json({
            error: {
              name: "AuthenticationError",
              message: "Authentication failed"
            }
          });
        }
      } catch (error) {
        res.status(500).json({
          error: {
            name: "AuthenticationError",
            message: "Authentication check failed"
          }
        });
      }
    });
  }

  app.use('/api/v1', setupRoutes(sdk));

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  return app;
}