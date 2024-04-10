import { User } from "./User";
import { UserDoesNotExist } from "./UserDoesNotExist";
import { UserId } from "./UserId";
import { UserRepository } from "./UserRepository";

export class UserFinder {
	constructor(private readonly repository: UserRepository) {}

	async find(id: string): Promise<User> {
		const user = await this.repository.search(new UserId(id));

		if (user === null) {
			throw new UserDoesNotExist(id);
		}

		return user;
	}
}
