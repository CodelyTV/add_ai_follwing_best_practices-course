import { jest } from "@jest/globals";

import { Cache } from "../../../../src/contexts/shared/domain/Cache";

export class MockCache implements Cache {
	private readonly mockHas = jest.fn();
	private readonly mockGet = jest.fn();
	private readonly mockSet = jest.fn();

	async has(key: string): Promise<boolean> {
		expect(this.mockHas).toHaveBeenCalledWith(key);

		return this.mockHas() as Promise<boolean>;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async get<T>(key: string, _deserializer: (parsedJson: any) => T): Promise<T | null> {
		expect(this.mockGet).toHaveBeenCalledWith(key, expect.anything());

		return this.mockGet() as Promise<T | null>;
	}

	async set<T>(key: string, value: T, ttlInSeconds: number): Promise<void> {
		expect(this.mockSet).toHaveBeenCalledWith(key, value, ttlInSeconds);

		return Promise.resolve();
	}

	shouldExist(key: string): void {
		this.mockHas(key);
		this.mockHas.mockReturnValueOnce(Promise.resolve(true));
	}

	shouldNotExist(key: string): void {
		this.mockHas(key);
		this.mockHas.mockReturnValueOnce(Promise.resolve(false));
	}

	shouldGet<T>(key: string, value: T): void {
		this.mockGet(key, expect.anything());
		this.mockGet.mockReturnValueOnce(value);
	}

	shouldSet<T>(key: string, value: T, ttlInSeconds: number): void {
		this.mockSet(key, value, ttlInSeconds);
	}
}
