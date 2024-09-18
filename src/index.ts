import dotenv from "dotenv";
import { sdkApi } from "./app";
import { RedisCacheStorage } from "./utils/RedisCacheStorage";

dotenv.config();

sdkApi({
	mode: "REAL",
	clientId: process.env.CLIENT_ID || "",
	cache: RedisCacheStorage.create({
		url: process.env.REDIS_URL || "",
	}),
	authentication: async (req, res, next) => {
		// Implement your custom authentication logic here
		return true
	}
});
