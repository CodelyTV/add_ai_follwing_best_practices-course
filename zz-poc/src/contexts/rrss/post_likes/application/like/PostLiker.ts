import { Clock } from "../../../../shared/domain/Clock";
import { EventBus } from "../../../../shared/domain/event/EventBus";
import { PostLike } from "../../domain/PostLike";
import { PostLikeRepository } from "../../domain/PostLikeRepository";

export class PostLiker {
	constructor(
		private readonly clock: Clock,
		private readonly repository: PostLikeRepository,
		private readonly eventBus: EventBus,
	) {}

	async like(id: string, postId: string, userId: string): Promise<void> {
		const postLike = PostLike.like(id, postId, userId, this.clock);

		await this.repository.save(postLike);
		await this.eventBus.publish(postLike.pullDomainEvents());
	}
}
