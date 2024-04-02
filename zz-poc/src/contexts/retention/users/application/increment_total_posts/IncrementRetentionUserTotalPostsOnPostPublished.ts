import { PostPublishedDomainEvent } from "../../../../rrss/posts/domain/PostPublishedDomainEvent";
import { UserDomainEvent } from "../../../../rrss/users/domain/UserDomainEvent";
import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { RetentionUserTotalPostsIncrementer } from "./RetentionUserTotalPostsIncrementer";

export class IncrementRetentionUserTotalPostsOnPostPublished
	implements DomainEventSubscriber<UserDomainEvent>
{
	constructor(private readonly incrementer: RetentionUserTotalPostsIncrementer) {}

	async on(event: PostPublishedDomainEvent): Promise<void> {
		await this.incrementer.increment(event.userId);
	}

	subscribedTo(): DomainEventClass[] {
		return [PostPublishedDomainEvent];
	}

	name(): string {
		return "codely.retention.increment_retention_user_total_posts_on_post_published";
	}
}
