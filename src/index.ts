import dotenv from "dotenv";
dotenv.config();

import { sdkApi } from "./app";
import { RedisCacheStorage } from "./cache/redis.storage";
import { InMemoryCacheStorage } from "@cedelabs-private/sdk";
import { hmacAuthStrategyMiddleware } from "./authentication/hmac.strategy";

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
		secretKey:  process.env.SECRET_API_KEY || "",
	}),
});
