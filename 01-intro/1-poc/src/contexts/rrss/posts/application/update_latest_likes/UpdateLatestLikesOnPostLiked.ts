import { UserDomainEvent } from "../../../../rrss/users/domain/UserDomainEvent";
import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { PostLikedDomainEvent } from "../../../post_likes/domain/PostLikedDomainEvent";
import { LatestLikesUpdater } from "./LatestLikesUpdater";

export class UpdateLatestLikesOnPostLiked implements DomainEventSubscriber<UserDomainEvent> {
	constructor(private readonly updater: LatestLikesUpdater) {}

	async on(event: PostLikedDomainEvent): Promise<void> {
		await this.updater.update(event.id, event.postId, event.userId, event.occurredOn);
	}

	subscribedTo(): DomainEventClass[] {
		return [PostLikedDomainEvent];
	}

	name(): string {
		return "codely.rrss.update_latest_likes_on_post_liked";
	}
}
