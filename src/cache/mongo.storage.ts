import { Any, SdkCacheStorage, SDKCacheItem } from "@cedelabs-private/sdk";
import mongoose, { Schema } from "mongoose";
import { Types } from "mongoose";
import sizeof from "object-sizeof";
import { splitDataToChunks } from "../utils/split";
import { logger } from '../services/logger';

type MongoSdkCacheItem = SDKCacheItem<Any> & {
	compoundData?: SDKCacheItem<Any>[];
	expiry?: string;
};

export type MongoCacheStorageConfig = {
	url: string;
};

const MongoCacheItemSchema = new mongoose.Schema<MongoSdkCacheItem>({
	key: { type: String, index: true },
	data: Object,
	expiry: { type: Date, expires: 0 },
	compoundData: [
		{ type: Schema.Types.ObjectId, ref: "CacheItem", required: false },
	],
});

const MongoCacheItem = mongoose.model("CacheItem", MongoCacheItemSchema);

const SIZE_LIMIT_BY_DOCUMENT = 15_000_000; // 16MB (document size limit) - 1MB (margin)

export class MongoCacheStorage implements SdkCacheStorage {
	static async create(
		config: MongoCacheStorageConfig
	): Promise<MongoCacheStorage> {
		const mongoCacheStorage = new MongoCacheStorage(config);
		await mongoCacheStorage.connect();
		return mongoCacheStorage;
	}

	constructor(private config: MongoCacheStorageConfig) {}

	async connect() {
		await mongoose.connect(this.config.url);
		logger.info('Connected to MongoDB');
	}

	init(data: Map<string, SDKCacheItem<Any>>): void {
		data.forEach((value, key) => {
			this.set(key, value);
		});
	}

	async get(key: string): Promise<SDKCacheItem<Any> | null> {
		const data = await MongoCacheItem.findOne({ key })
			.populate("compoundData")
			.exec();
		if (!data) return null;
		if (data.compoundData) {
			const allData = [
				data.data,
				...data.compoundData.map((subData) => subData.data),
			].join("");
			data.data = allData;
		}
		const objectData = data.toObject() as SDKCacheItem<Any>;
		objectData.data = JSON.parse(objectData.data);
		return {
			key: objectData.key,
			data: objectData.data,
			expiry: new Date(objectData.expiry as unknown as string).getTime(),
		};
	}

	async set(key: string, value: SDKCacheItem<Any>): Promise<void> {
		const stringifiedData = JSON.stringify(value.data);
		const item: MongoSdkCacheItem = {
			key,
			data: stringifiedData,
			expiry: value.expiry ? new Date(value.expiry).toUTCString() : undefined,
		};
		const dataSize = sizeof(stringifiedData);

		if (dataSize > SIZE_LIMIT_BY_DOCUMENT) {
			const dataChunks = splitDataToChunks(SIZE_LIMIT_BY_DOCUMENT, stringifiedData);
			const mainChunk = dataChunks.shift();
			if (!mainChunk) return;

			const subChunks = dataChunks.map((data, index) => ({
				_id: new Types.ObjectId(),
				key: `${key}:::${index + 2}`,
				data,
				expiry: value.expiry ? new Date(value.expiry).toUTCString() : undefined,
			}));

			const mainItem = {
				key: `${key}`,
				data: mainChunk,
				expiry: value.expiry ? new Date(value.expiry).toUTCString() : undefined,
				compoundData: subChunks.map((subChunk) => subChunk._id),
			};
			await MongoCacheItem.insertMany([mainItem, ...subChunks]);
			return;
		}
		await MongoCacheItem.updateOne({ key }, item, { upsert: true })
			.exec()
			.catch((err) => {
				logger.error('Error updating cache item:', err);
			});
	}

	async remove(key: string): Promise<void> {
		await MongoCacheItem.deleteOne({ key });
	}

	async removeByIncludedStrings(includedStrings: string[]): Promise<string[]> {
		await MongoCacheItem.deleteMany({
			key: { $regex: `(${includedStrings.join("|")})` },
		});
		return includedStrings;
	}

}
