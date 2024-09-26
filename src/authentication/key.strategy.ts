import { AuthenticationMiddlewareFactory } from "../types";

/**
 * Key based authentication middleware.
 *
 * The request must contain a header `x-key` with the value of the secret API key to pass.
 */
export const keyAuthStrategyMiddleware: AuthenticationMiddlewareFactory<{
	apiKey: string;
}> =
	({ apiKey }) =>
	(req) => {
		const headers = req.headers;
		const receivedApiKey = headers["x-key"];
		return receivedApiKey === apiKey;
	};
