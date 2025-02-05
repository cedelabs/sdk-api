import dotenv from "dotenv";
dotenv.config();

import { InMemoryCacheStorage } from "@cedelabs-private/sdk";
import { env } from "process";
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

const clientId = process.env.CLIENT_ID || "";
if (clientId === "" && env.MODE === "REAL") {
	throw new Error("CLIENT_ID is required");
}

sdkApi({
	mode: env.MODE === "MOCK" ? "MOCK" : "REAL",
	clientId,
	cache: getCache(),
	authentication: env.DEMO === "true" || process.env.SECRET_API_KEY === undefined ? () => true : hmacAuthStrategyMiddleware({
		secretKey:  process.env.SECRET_API_KEY || "",
	}),
});
