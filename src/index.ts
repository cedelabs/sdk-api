import dotenv from "dotenv";
dotenv.config();

import { InMemoryCacheStorage } from "@cedelabs-private/sdk";
import { env } from "process";
import { sdkApi } from "./app";
import { hmacAuthStrategyMiddleware } from "./authentication/hmac.strategy";
import { MongoCacheStorage } from "./cache/mongo.storage";
import { RedisCacheStorage } from "./cache/redis.storage";

const getCache = () => {
	if (process.env.REDIS_URL) {
		return RedisCacheStorage.create({
			url: process.env.REDIS_URL,
		});
	} else if (process.env.MONGODB_URL) {
		return MongoCacheStorage.create({
			url: process.env.MONGODB_URL,
		});
	}

	return new InMemoryCacheStorage();
}

const clientId = process.env.CLIENT_ID || "";
if (clientId === "" && env.MODE === "REAL") {
	throw new Error("CLIENT_ID is required");
}
const secretApiKey = process.env.SECRET_API_KEY || "";
const proxyUrl = process.env.PROXY_URL || "";
const verbose = process.env.VERBOSE as "vv" | "v" | undefined;

console.log(`SDK-API config: 

	mode: ${env.MODE === "MOCK" ? "MOCK" : "REAL"},
	clientId: ${clientId},
	proxyUrl: ${proxyUrl},
	sdk-api authentication enabled: ${!secretApiKey ? "NO" : "YES"}
	cache: ${getCache().constructor.name}
	verbose: ${verbose ? "YES" : "NO"}
	${getCache().constructor.name === "InMemoryCacheStorage" ? 
		"🚧 You are using an in-memory cache. We recommend using Redis cache in production to avoid rate limiting issues." : ""}
`)

sdkApi({
	mode: env.MODE === "MOCK" ? "MOCK" : "REAL",
	clientId,
	cache: getCache(),
	proxyUrl,
	verbose,
	authentication: !secretApiKey ? () => true : hmacAuthStrategyMiddleware({
		secretKey: secretApiKey,
	}),
});
