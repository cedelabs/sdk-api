# SDK Api

## What is HTTP Cede SDK Api?

The HTTP Cede SDK API serves as the HTTP service for the `@cedelabs-private/sdk` package. This API enables seamless integration of the package with external services by exposing a well-defined HTTP interface, facilitating effortless communication and interoperability with other systems.

This project is designed to be highly customizable according to your need and hosted on-premise.

## Getting started

### Installation & Start

1. Clone the repository
```
git clone git@github.com:cedelabs/sdk-api.git
```

2. Install the dependencies
```
yarn install
```

3. Start the server in dev mode
```
yarn dev
```

or using docker
```
docker compose up
```

### Configure to your needs

You should edit the file `src/index.ts` to configure the service according to your needs. 

```typescript
sdkApi({
	mode: "REAL",
	clientId: process.env.CLIENT_ID || "",
	cache:
		process.env.NODE_ENV === "development"
			? new InMemoryCacheStorage()
			: RedisCacheStorage.create({
					url: process.env.REDIS_URL || "",
			  }),
	authentication: hmacAuthStrategyMiddleware({
		secretKey: process.env.SECRET_API_KEY || "",
	}),
});
```

- `mode`: `"REAL"` instance will use real exchange API, while `"MOCK"` instance will use mock API. The "MOCK" instance does not require a valid client ID and will let you test your integration without real funds and API keys.

- `clientId`: Client Id provided by Cede Team to get access to the SDK features.

- `cache`, optional: By default, the Cede SDK utilizes `InMemoryCacheStorage`, which, as the name implies, stores cache data in memory. This means that when the server instance is shut down, all cached data is lost. To persist cache data beyond server restarts, you can implement a custom cache storage solution tailored to your needs or use `RedisCacheStorage`. The instantiation could be asynchrone if you need to connect to external database.
```typescript
sdkApi({
  ...config,
	cache: RedisCacheStorage.create({ url: process.env.REDIS_URL || "" }),
});
```

- `credentials`, optional: If you need to get the credentials from a specific storage system, you can provide a connector to the SDK Api. The instantiation could be asynchrone if you need to connect to an external database.
```typescript
sdkApi({
  ...config,
	credentials: {
		get: async () => {
			// Fetch credentials from your own storage.
			// This is called when the SDK needs credentials to make API calls.
		},
		set: async (credentials) => {
			// Store the credentials in your own storage.
			// This is called when the SDK has new credentials to store.
		},
		remove: async () => {
			// Remove the credentials from your own storage.
			// This is called when the SDK needs to remove credentials.
		}
	},
});
```

- `authentication`, optional (but highly recommended): Authentication strategy callback for protecting the access to the SDK server. You can implement your own strategy or using the already implemented `keyAuthStrategyMiddleware` or `hmacAuthStrategyMiddleware`.
```typescript
sdkApi({
  ...configuration,
	authentication: hmacAuthStrategyMiddleware({
		secretKey: process.env.SECRET_API_KEY || "",
	}),
});
```

- `proxyUrl`, optional: When configured, either for private endpoints or when the `isProxied` flag is set to true during exchange registration, requests are routed through a proxy. This feature is particularly useful for scenarios where users need to whitelist a specific range of IP addresses, enhancing control and security.

- `webhookHeaders`, optional: A function designed to generate additional headers for inclusion in requests sent to a webhook endpoint. It can be useful to authenticate the request. <br />
*The webhook can be triggered when the service detects a state change within the Exchange after the call of a one time listener (like `onDeposit` method, see the [documentation](https://docs-sdk.cede.store/documentation/api-reference/deposit#on-deposit-callback?mode=http)). It facilitates the transmission of updated data back to the client.*
```typescript
sdkApi({
  ...config,
	webhookHeaders: async (req: Request) => ({
    'x-signature': await generateSignature(req)
  })
});
```

- `onDeposit`, optional: If you don't want to use a webhook to receive the data from the one-time listener `onDeposit`, you can implement this method. Once the deposit will be received by the SDK, this method will be called. 
```typescript
sdkApi({
  ...config,
	onDeposit: (tx: PureTransaction) => {
    // ... Do your business
  }
});
```

- `listenerByEvent`, optional: To add a dedicated listener by event. 
```typescript
sdkApi({
  ...config,
	listenerByEvent: {
		[HydrationItem.BALANCES]: ({ exchangeInstanceId, walletType, balance }) => {
			// `balance` contains balances freshly fetched from the exchange.
			// You can ping your own API or the client with this data.
		},
		[CedeSDKEvents.OAUTH_REFRESHED]: ({ exchangeInstanceId, tokens }) => {
			// `tokens` contains the refreshed tokens.
		},
	},
});
```

- `eventListener`, optional: To add a global listener for all the events.
```typescript
sdkApi({
  ...config,
	eventListener: (event, data) => {
		// This is a generic event listener for all events.
		// You can listen to specific events using `listenerByEvent` instead.
	},
});
```

## How it works?

Your clients can use the HTTP SDK API following this structure regarding the HTTP requests.

```http
POST /execute?method=<method_name>
{
  // ... Method params in the body
}
```

Please read the Cede SDK [documentation](https://docs-sdk.cede.store/documentation/general-info) to understand how it works.

## Support

👉 [**Give us feedbacks**](https://github.com/cedelabs/cede.store/issues/new/choose)
