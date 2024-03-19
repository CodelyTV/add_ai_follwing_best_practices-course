import { PostPublishedDomainEvent } from "../../../../rrss/posts/domain/PostPublishedDomainEvent";
import { UserDomainEvent } from "../../../../rrss/users/domain/UserDomainEvent";
import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { RetentionPostCreator } from "./RetentionPostCreator";

export class CreateRetentionPostOnPostPublished implements DomainEventSubscriber<UserDomainEvent> {
	constructor(private readonly creator: RetentionPostCreator) {}

	async on(event: PostPublishedDomainEvent): Promise<void> {
		await this.creator.create(event.id, event.userId);
	}

	subscribedTo(): DomainEventClass[] {
		return [PostPublishedDomainEvent];
	}

	name(): string {
		return "codely.retention.create_retention_post_on_post_published";
	}
}
