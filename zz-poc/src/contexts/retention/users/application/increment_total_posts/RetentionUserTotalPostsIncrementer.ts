import { UserId } from "../../../../rrss/users/domain/UserId";
import { RetentionUserDoesNotExist } from "../../domain/RetentionUserDoesNotExist";
import { RetentionUserRepository } from "../../domain/RetentionUserRepository";

export class RetentionUserTotalPostsIncrementer {
	constructor(private readonly repository: RetentionUserRepository) {}

	async increment(id: string): Promise<void> {
		const user = await this.repository.search(new UserId(id));

		if (!user) {
			throw new RetentionUserDoesNotExist(id);
		}

		user.incrementTotalPosts();

		await this.repository.save(user);
	}
}
