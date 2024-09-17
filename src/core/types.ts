import { Any, SdkCacheStorage, CredentialsStorage, DefiInfoTx, EventEmitterDataTypes, PureCefiInfoTx, PureTransaction } from "@cedelabs-private/sdk";



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
	listenerByEvent?: Record<
		keyof EventEmitterDataTypes,
		(
			data: EventEmitterDataTypes[keyof EventEmitterDataTypes]
		) => void | Promise<void>
	>;
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
	webhookHeaders?: Record<string, string>;
};
