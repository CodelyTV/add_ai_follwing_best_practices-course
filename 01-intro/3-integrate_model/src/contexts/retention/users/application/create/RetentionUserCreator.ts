import { UserId } from "../../../../rrss/users/domain/UserId";
import { RetentionUser } from "../../domain/RetentionUser";
import { RetentionUserRepository } from "../../domain/RetentionUserRepository";

export class RetentionUserCreator {
	constructor(private readonly repository: RetentionUserRepository) {}
	async create(id: string, email: string, name: string): Promise<void> {
		if (await this.repository.search(new UserId(id))) {
			return;
		}

		const user = RetentionUser.create(id, email, name);

		await this.repository.save(user);
	}
}
