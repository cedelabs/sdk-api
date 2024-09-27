import {
	Any,
	SdkCacheStorage,
	CredentialsStorage,
	DefiInfoTx,
	EventEmitterDataTypes,
	PureCefiInfoTx,
	PureTransaction,
} from "@cedelabs-private/sdk";
import { NextFunction, Request, Response } from "express";

export type AuthenticationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<boolean | void> | boolean | void;

export type AuthenticationMiddlewareFactory<T extends Record<string, any>> = (
	config: T
) => AuthenticationMiddleware;

export type SdkApiConfiguration = {
	/**
	 * Mode of the SDK.
	 *
	 * - `"REAL"`: Real mode will make actual API calls to Exchange APIs and will return real data.
	 *
	 * - `"MOCK"`: Mock mode will return mock data for the Exchange API calls.
	 */
	mode: "MOCK" | "REAL";
	/**
	 * Client id provided by Cede Labs
	 */
	clientId: string;
	/**
	 * Storage implementation for credentials provider
	 */
	credentials?: CredentialsStorage | Promise<CredentialsStorage>;
	/**
	 * Storage implementation for cache provider
	 */
	cache?: SdkCacheStorage | Promise<SdkCacheStorage>;
	/**
	 * Proxy URL to be used for making Exchange API calls for some exchanges that require it.
	 */
	proxyUrl?: string;
	/**
	 * Plug in your own event listeners for the SDK by event name.
	 */
	listenerByEvent?: Partial<{
		[K in keyof EventEmitterDataTypes]: (
			params: EventEmitterDataTypes[K]
		) => void | Promise<void>;
	}>;
	/**
	 * Plug in your own event listener for the SDK.
	 */
	eventListener?: (
		event: keyof EventEmitterDataTypes,
		data: Any
	) => void | Promise<void>;

	/**
	 * Event listener for deposit transactions.
	 */
	onDeposit?: (
		tx: PureTransaction<DefiInfoTx, PureCefiInfoTx>
	) => void | Promise<void>;

	/**
	 * The headers to be sent with the webhook request (when webhook parameter is provided in the request).
	 */
	webhookHeaders?: (
		req: Request
	) => Record<string, string> | Promise<Record<string, string>>;

	/**
	 * This middleware is responsible for authorizing or blocking incoming requests based on custom logic.
	 *
	 * If the function returns false, the request will be blocked, and no further processing will occur.
	 *
	 * If the function returns true, the request will be authorized and allowed to proceed.
	 *
	 * If the function does not return a value, it is expected to either call next() to continue the request lifecycle
	 * or explicitly reject the request.
	 */
	authentication?: AuthenticationMiddleware;
};
