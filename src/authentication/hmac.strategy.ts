import crypto from "crypto";
import { AuthenticationMiddlewareFactory } from "../types";

const sign = (payload: string, secret: string) => {
	return crypto.createHmac("sha512", secret).update(payload).digest("hex");
};

const stringify = (data: any) => {
	return data ? JSON.stringify(data) : "{}";
};

/**
 * Signature based authentication middleware.
 * The request must contain
 * - a header `x-signature` with the value of the HMAC signature
 * - a header `x-timestamp` with the value of the timestamp
 *
 * The signature payload is constructed by concatenating the query string, the request body and the timestamp.
 * `{queryString}.{bodyString}.{timestamp}`
 */
export const hmacAuthStrategyMiddleware: AuthenticationMiddlewareFactory<{
	secretKey: string;
}> =
	({ secretKey }) =>
	(req) => {
		if (!secretKey) {
			throw new Error("SECRET_API_KEY is not set");
		}

		const receivedSignature = req.headers["x-signature"];
		const timestamp = req.headers["x-timestamp"];
		const query = req.query;
		const body = req.body;
		const payload = `${stringify(query)}.${stringify(body)}.${timestamp}`;
		const signature = sign(payload, secretKey);

		return signature === receivedSignature;
	};
