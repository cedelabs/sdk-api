import {
	Any,
	InvalidParamsError,
	PureTransaction,
} from "@cedelabs-private/sdk";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { setupCedeSdk } from "./utils/sdk";
import { SdkApiConfiguration } from "./types";
import { processError } from "./utils";

export async function sdkApi(configuration: SdkApiConfiguration) {
	const sdk = await setupCedeSdk(configuration);
	const app: Express = express();
	const port = process.env.PORT || 3000;

	app.use(bodyParser.json());

	if (configuration.authentication) {
		app.use(async (req, res, next) => {
			const isAuthenticated = await configuration.authentication?.(
				req,
				res,
				next
			);
			if (isAuthenticated === false) {
				res.status(401).json({ message: "Unauthorized" });
				return;
			}

			if (isAuthenticated === true) {
				next();
				return;
			}
			// If the function does not return a value, it is expected to either call next() to continue the request lifecycle 
			// or explicitly reject the request.
		});
	}

	app.get("/", (_: Request, res: Response) => {
		res.send("CedeLabs SDK API");
	});

	app.post("/execute", async (req: Request, res: Response) => {
		const body = req.body;
		const { method } = req.query;

		try {
			if (!method) {
				throw new InvalidParamsError("method query parameter is required");
			}

			if (typeof method !== "string") {
				throw new InvalidParamsError("method query parameter must be a string");
			}

			if (!(await sdk.api.method({ method }))) {
				throw new InvalidParamsError(`method ${method} is not supported`);
			}

			if (method === "onDeposit") {
				if (!configuration.onDeposit && !body.webhook) {
					throw new InvalidParamsError(
						"Either onDeposit callback or webhook parameter is required"
					);
				}

				if (configuration.onDeposit) {
					await sdk.api.onDeposit({
						...body,
						callback: configuration.onDeposit,
					});
				}

				if (body.webhook) {
					await sdk.api.onDeposit({
						...body,
						callback: async (tx: PureTransaction) => {
							const webhookUrl = body.webhook;
							await fetch(webhookUrl, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									...await configuration.webhookHeaders?.(req),
								},
								body: JSON.stringify(tx),
							});
						},
					});
				}
				return res.status(200).json({ message: "success" });
			}

			const result = await sdk.executeApiMethod(method, body);
			res.status(200).json(result);
		} catch (error: Any) {
			console.error(error)
			res.status(500).json(processError(error));
		}
	});

	app.listen(port, () => {
		console.log(`[server]: Server is running at http://localhost:${port}`);
	});
}
