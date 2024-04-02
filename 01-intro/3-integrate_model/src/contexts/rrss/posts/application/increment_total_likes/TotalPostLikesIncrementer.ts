import { EventBus } from "../../../../shared/domain/event/EventBus";
import { PostDoesNotExist } from "../../domain/PostDoesNotExist";
import { PostId } from "../../domain/PostId";
import { PostRepository } from "../../domain/PostRepository";

export class TotalPostLikesIncrementer {
	constructor(
		private readonly repository: PostRepository,
		private readonly eventBus: EventBus,
	) {}

	async increment(id: string): Promise<void> {
		const post = await this.repository.search(new PostId(id));

		if (!post) {
			throw new PostDoesNotExist(id);
		}

		post.incrementTotalLikes();

		await this.repository.save(post);
		await this.eventBus.publish(post.pullDomainEvents());
	}
}
