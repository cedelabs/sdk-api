# SDK API

## What is HTTP Cede SDK API?

The HTTP Cede SDK API serves as the HTTP service for the `@cedelabs-private/sdk` package. This API enables seamless integration of the package with external services by exposing a well-defined HTTP interface, facilitating effortless communication and interoperability with other systems.

This project is designed to be highly customizable according to your need and hosted on-premise.

## Getting started

### Installation & Start

**1. Clone the repository**
```
git clone git@github.com:cedelabs/sdk-api.git
```

**2. Setup the .env**

Create a .env from the .env.example file and fill the variables. 

**3. Configure your environment to get access to the Cede SDK**

The Cede Team uses the AWS component CodeArtifact to deliver the private package `@cedelabs-private/sdk`. To get access to it, you have to authenticate to AWS using the **aws cli**. Run the command `aws configure` and provide your Access key ID and Secret Access key.
Then, you can connect to CodeArtifact using the following statement: 

```
aws codeartifact login --tool npm --repository cedelabs-private --domain cedelabs-private --domain-owner 343260416470 --region eu-west-1 --namespace @cedelabs-private
```


> 💡 This command :
> - Adds an authorization token after fetching it from CodeArtifact using your AWS credentials to your npm config
> - Set the registry for all the packages of `@cedelabs-private` scope in your npm config.


> ⚠️ You can check that the registry is correctly updated by executing the command `yarn config list` . The default registry should stay the same as usual, but you should see “@cedelabs-private:registry": "<REPOSITORY URL>"

**4. Install the dependencies**
```
pnpm i
```

**5. Start the server in dev mode**
```
pnpm dev
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
	cache: getCache(),
	authentication: hmacAuthStrategyMiddleware({
		secretKey:  process.env.SECRET_API_KEY || "",
	}),
});
```

- `mode`: `"REAL"` instance will use real exchange API, while `"MOCK"` instance will use mock API. The "MOCK" instance does not require a valid client ID and will let you test your integration without real funds and API keys.

- `clientId`: Client Id provided by Cede Team to get access to the SDK features.

- `cache`, optional: By default, the Cede SDK utilizes `InMemoryCacheStorage`, which shouldn't be used in production. For production, you can implement a custom cache storage solution tailored to your needs or take advantage of the ready-to-use `RedisCacheStorage`. The instantiation could be asynchrone if you need to connect to external database.
```typescript
sdkApi({
  ...config,
	cache: RedisCacheStorage.create({ url: process.env.REDIS_URL || "" }),
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

## OpenAPI Documentation

This project uses TSOA to automatically generate OpenAPI 3.0 documentation from TypeScript code. To generate and use the API documentation:

1. Generate the OpenAPI specification and routes:
```bash
pnpm tsoa spec
pnpm tsoa routes
```

2. Build the project:
```bash
pnpm build
```

This provides clear instructions for generating and using the API documentation while highlighting the important steps for setting up Postman correctly.

### Using with Postman

1. Import the generated `swagger.json` file into Postman
2. Replace the placeholder values in headers:
   - `x-exchange-id`: Your exchange instance ID
   - `x-exchange-api-key`: Your API key
   - `x-exchange-api-secret`: Your API secret
   - `x-exchange-api-uid`: Your exchange UID (if required, check with `exchange/supported` endpoint)
   - `x-exchange-api-password`: Your exchange password (if required, check with `exchange/supported` endpoint)

3. Update request parameters:
   - For GET requests: Fill in the required query parameters
   - For POST requests: Provide the required request body

The imported documentation includes detailed descriptions of all endpoints, required parameters, and expected responses.


## Support

👉 [**Give us feedbacks**](https://github.com/cedelabs/cede.store/issues/new/choose)