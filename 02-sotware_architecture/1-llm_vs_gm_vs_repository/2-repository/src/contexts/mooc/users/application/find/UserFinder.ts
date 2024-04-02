import { User } from "../../domain/User";
import { UserDoesNotExist } from "../../domain/UserDoesNotExist";
import { UserId } from "../../domain/UserId";
import { UserRepository } from "../../domain/UserRepository";

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
