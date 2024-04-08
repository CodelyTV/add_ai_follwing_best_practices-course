import {
	createClient,
	RedisClientType,
	RedisDefaultModules,
	RedisFunctions,
	RedisModules,
	RedisScripts,
} from "redis";

export class RedisClient {
	private readonly client: Promise<
		RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>
	>;

	constructor() {
		this.client = createClient().connect();
	}

	async has(key: string): Promise<boolean> {
		return (await (await this.client).exists(key)) === 1;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public async get<T>(key: string, deserializer: (parsedJson: any) => T): Promise<T | null> {
		const value = await (await this.client).get(key);

		if (value !== null) {
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const parsedValue = JSON.parse(value);

				return deserializer(parsedValue);
			} catch (error) {
				console.error("Error parsing JSON from Redis", error);

				return null;
			}
		}

		return null;
	}

	public async set<T>(key: string, value: T, ttlInSeconds: number): Promise<void> {
		const serializedValue = JSON.stringify(value);

		await (await this.client).set(key, serializedValue, { EX: ttlInSeconds });
	}

	async flushAll(): Promise<void> {
		await (await this.client).flushAll();
	}
}
