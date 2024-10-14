import dotenv from "dotenv";
dotenv.config();

import { InMemoryCacheStorage } from "@cedelabs-private/sdk";
import { sdkApi } from "./app";
import { hmacAuthStrategyMiddleware } from "./authentication/hmac.strategy";
import { MongoCacheStorage } from "./cache/mongo.storage";

const getCache = () => {
	if (process.env.NODE_ENV === "development" || !process.env.REDIS_URL) {
		console.log("[server]: 🚧 You are using an in-memory cache. Please use Redis cache in production.");
		return new InMemoryCacheStorage();
	}
	return MongoCacheStorage.create({
		url: process.env.MONGODB_URL || "",
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
