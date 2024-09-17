import dotenv from "dotenv";
import { sdkApi } from "./core/app";
import { RedisCacheStorage } from "./core/utils/RedisCacheStorage";

dotenv.config();

sdkApi({
	mode: "REAL",
	clientId: process.env.CLIENT_ID || "",
	cache: RedisCacheStorage.create({
		url: process.env.REDIS_URL || "",
	})
});
