import { Any, SdkCacheStorage, SDKCacheItem } from "@cedelabs-private/sdk";
import { createClient, RedisClientType } from "redis";
import { safeJsonParse } from "../utils/json";
import { logger } from "../services/logger";
export type RedisCacheStorageConfig = {
	url: string;
};

export class RedisCacheStorage implements SdkCacheStorage {
	private client: RedisClientType;

	static async create(
		config: RedisCacheStorageConfig
	): Promise<RedisCacheStorage> {
		const redisCacheStorage = new RedisCacheStorage(config);
		await redisCacheStorage.connect();
		return redisCacheStorage;
	}

	constructor(config: RedisCacheStorageConfig) {
		this.client = createClient({
			url: config.url,
		}).on("error", (err) =>
			logger.error("Redis Client Error", err)
		) as RedisClientType;
	}

	async connect() {
		return this.client.connect();
	}

	init(data: Map<string, SDKCacheItem<Any>>): void {
		data.forEach((value, key) => {
			this.set(key, value);
		});
	}

	async get(key: string): Promise<SDKCacheItem<Any> | null> {
		const rawData = await this.client.get(key);
		if (!rawData) return null;

		const data = safeJsonParse(rawData);
		return data;
	}
	async set(key: string, value: SDKCacheItem<Any>): Promise<void> {
		await this.client.set(key, JSON.stringify(value), {
			PXAT: value.expiry,
		});
	}
	async remove(key: string): Promise<void> {
		await this.client.del(key);
	}

	async removeByIncludedStrings(includedStrings: string[]): Promise<string[]> {
		const deletedKeys: string[] = [];
		const iterator = this.client.scanIterator({
			TYPE: "string",
			MATCH: `*${includedStrings.join("*")}*`,
		});
		for await (const key of iterator) {
			await this.remove(key);
			deletedKeys.push(key);
		}
		return deletedKeys;
	}
}
