import dotenv from "dotenv";
dotenv.config();

import { InMemoryCacheStorage } from "@cedelabs-private/sdk";
import { sdkApi } from "./app";
import { hmacAuthStrategyMiddleware } from "./authentication/hmac.strategy";
import { RedisCacheStorage } from "./cache/redis.storage";

const getCache = () => {
	if (process.env.NODE_ENV === "development" || !process.env.REDIS_URL) {
		console.log("[server]: 🚧 You are using an in-memory cache. Please use Redis cache in production.");
		return new InMemoryCacheStorage();
	}
	return RedisCacheStorage.create({
		url: process.env.REDIS_URL,
	});
}

sdkApi({
	mode: "REAL",
	clientId: process.env.CLIENT_ID || "",
	cache: getCache(),
	authentication: hmacAuthStrategyMiddleware({
		secretKey:  process.env.SECRET_API_KEY || "",
	}),
});
