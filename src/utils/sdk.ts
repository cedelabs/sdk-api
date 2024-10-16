import CedeSDK, { CedeSDKEvents, EventEmitterDataTypes, HydrationItem } from "@cedelabs-private/sdk";
import { SdkApiConfiguration } from "../types";

export async function setupCedeSdk(configuration: SdkApiConfiguration) {
	const sdk = new CedeSDK(configuration.mode, {
		clientId: configuration.clientId,
		proxyUrl: configuration.proxyUrl,
		cacheStorage: await configuration.cache,
		credentialsStorage: await configuration.credentials
	});

	if (configuration.listenerByEvent) {
		Object.entries(configuration.listenerByEvent).forEach(([event, listener]) => {
      sdk.eventEmitter.on(event as keyof EventEmitterDataTypes, listener as any);
    });
	}

  if (configuration.eventListener) {
    [...Object.values(CedeSDKEvents), ...Object.values(HydrationItem)].forEach((event) => {
      sdk.eventEmitter.on(
				event as keyof EventEmitterDataTypes,
				(data) => configuration.eventListener?.(event, data)
			);
    });
  }

	return sdk;
}
