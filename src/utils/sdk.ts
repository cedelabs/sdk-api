import CedeSDK, { CedeSDKEvents, EventEmitterDataTypes } from "@cedelabs-private/sdk";
import { SdkApiConfiguration } from "../types";
import { logger } from '../services/logger';

// @todo add back the HydrationItem

export async function setupCedeSdk(configuration: SdkApiConfiguration) {
	const sdk = new CedeSDK(configuration.mode, {
		clientId: configuration.clientId,
		proxyUrl: configuration.proxyUrl,
		cacheStorage: await configuration.cache,
		verbose: configuration.verbose,
		logger
	});

	if (configuration.listenerByEvent) {
		Object.entries(configuration.listenerByEvent).forEach(([event, listener]) => {
      sdk.eventEmitter.on(event as keyof EventEmitterDataTypes, listener as any);
    });
	}

	if (configuration.eventListener) {
		Object.values(CedeSDKEvents).forEach((event) => {
			sdk.eventEmitter.on(
				event as keyof EventEmitterDataTypes,
				(data) => configuration.eventListener?.(event, data)
			);
		});
	}

	return sdk;
}
