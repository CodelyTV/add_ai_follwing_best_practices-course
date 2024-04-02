import { UserId } from "../../../../rrss/users/domain/UserId";
import { RetentionUserDoesNotExist } from "../../domain/RetentionUserDoesNotExist";
import { RetentionUserRepository } from "../../domain/RetentionUserRepository";

export class RetentionUserEmailUpdater {
	constructor(private readonly repository: RetentionUserRepository) {}
	async update(id: string, email: string): Promise<void> {
		const user = await this.repository.search(new UserId(id));

		if (!user) {
			throw new RetentionUserDoesNotExist(id);
		}

		user.updateEmail(email);

		await this.repository.save(user);
	}
}
