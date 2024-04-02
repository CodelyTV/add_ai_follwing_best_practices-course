import { UserDomainEvent } from "../../../../rrss/users/domain/UserDomainEvent";
import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { PostLikedDomainEvent } from "../../../post_likes/domain/PostLikedDomainEvent";
import { TotalPostLikesIncrementer } from "./TotalPostLikesIncrementer";

export class IncrementTotalPostLikesOnPostLiked implements DomainEventSubscriber<UserDomainEvent> {
	constructor(private readonly incrementer: TotalPostLikesIncrementer) {}

	async on(event: PostLikedDomainEvent): Promise<void> {
		await this.incrementer.increment(event.postId);
	}

	subscribedTo(): DomainEventClass[] {
		return [PostLikedDomainEvent];
	}

	name(): string {
		return "codely.rrss.increment_total_post_likes_on_post_liked";
	}
}
