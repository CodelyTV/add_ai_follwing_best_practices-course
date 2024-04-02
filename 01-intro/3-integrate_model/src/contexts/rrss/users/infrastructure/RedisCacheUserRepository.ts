/* eslint-disable no-console */
import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { RedisClient } from "../../../shared/infrastructure/RedisClient";
import { User, UserPrimitives } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

export class RedisCacheUserRepository implements UserRepository {
	constructor(
		private readonly repository: UserRepository,
		private readonly client: RedisClient,
	) {}

	async save(user: User): Promise<void> {
		return this.repository.save(user);
	}

	async search(id: UserId): Promise<User | null> {
		return this.repository.search(id);
	}

	async matching(criteria: Criteria): Promise<User[]> {
		if (await this.client.has(criteria.toString())) {
			return await this.findInCache(criteria);
		}

		console.log("→ Obteniendo de base de datos");
		const users = await this.repository.matching(criteria);

		await this.saveInCache(criteria, users);

		return users;
	}

	private async findInCache(criteria: Criteria): Promise<User[]> {
		console.log("→ Obteniendo de caché");

		return (await this.client.get(criteria.toString(), (primitives: UserPrimitives[]) =>
			primitives.map((data) => User.fromPrimitives(data)),
		)) as User[];
	}

	private async saveInCache(criteria: Criteria, users: User[]): Promise<void> {
		await this.client.set(
			criteria.toString(),
			users.map((user) => user.toPrimitives()),
			100,
		);
	}
}
