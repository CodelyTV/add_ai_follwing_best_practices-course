import { RetentionPostFinder } from "../../../posts/application/find/RetentionPostFinder";
import { RetentionUserDoesNotExist } from "../../domain/RetentionUserDoesNotExist";
import { RetentionUserRepository } from "../../domain/RetentionUserRepository";

export class RetentionUserAveragePostLikesRecalculator {
	constructor(
		private readonly postFinder: RetentionPostFinder,
		private readonly repository: RetentionUserRepository,
	) {}

	async recalculate(postId: string): Promise<void> {
		const post = await this.postFinder.find(postId);
		const user = await this.repository.search(post.userId);

		if (!user) {
			throw new RetentionUserDoesNotExist(post.userId.value);
		}

		user.recalculateAveragePostLikes();

		await this.repository.save(user);
	}
}
