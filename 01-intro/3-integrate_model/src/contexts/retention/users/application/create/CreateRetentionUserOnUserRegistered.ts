import { UserDomainEvent } from "../../../../rrss/users/domain/UserDomainEvent";
import { UserRegisteredDomainEvent } from "../../../../rrss/users/domain/UserRegisteredDomainEvent";
import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { RetentionUserCreator } from "./RetentionUserCreator";

export class CreateRetentionUserOnUserRegistered implements DomainEventSubscriber<UserDomainEvent> {
	constructor(private readonly creator: RetentionUserCreator) {}

	async on(event: UserRegisteredDomainEvent): Promise<void> {
		await this.creator.create(event.id, event.email, event.name);
	}

	subscribedTo(): DomainEventClass[] {
		return [UserRegisteredDomainEvent];
	}

	name(): string {
		return "codely.retention.create_retention_user_on_user_registered";
	}
}
