import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

export class InMemoryCacheUserRepository implements UserRepository {
	private readonly usersCache: Map<UserId, User> = new Map();

	constructor(private readonly repository: UserRepository) {}

	async save(user: User): Promise<void> {
		await this.repository.save(user);

		this.usersCache.set(user.id, user);
	}

	async search(id: UserId): Promise<User | null> {
		const userFromCache = this.usersCache.get(id);

		if (userFromCache) {
			return userFromCache;
		}

		const userFromDatabase = await this.repository.search(id);

		if (userFromDatabase) {
			this.usersCache.set(id, userFromDatabase);
		}

		return userFromDatabase;
	}
}
