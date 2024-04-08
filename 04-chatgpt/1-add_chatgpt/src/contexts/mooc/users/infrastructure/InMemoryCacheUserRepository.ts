import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

export class InMemoryCacheUserRepository implements UserRepository {
	private readonly users: Map<UserId, User> = new Map();

	constructor(private readonly repository: UserRepository) {}

	async save(user: User): Promise<void> {
		await this.repository.save(user);

		this.users.set(user.id, user);
	}

	async search(id: UserId): Promise<User | null> {
		const user = this.users.get(id);
		if (!user) {
			const user = await this.repository.search(id);
			if (user) {
				this.users.set(id, user);
			}

			return user;
		}

		return user;
	}
}
