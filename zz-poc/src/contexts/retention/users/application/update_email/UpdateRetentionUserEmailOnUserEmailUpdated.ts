import { UserDomainEvent } from "../../../../rrss/users/domain/UserDomainEvent";
import { UserEmailUpdatedDomainEvent } from "../../../../rrss/users/domain/UserEmailUpdatedDomainEvent";
import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { RetentionUserEmailUpdater } from "./RetentionUserEmailUpdater";

export class UpdateRetentionUserEmailOnUserEmailUpdated
	implements DomainEventSubscriber<UserDomainEvent>
{
	constructor(private readonly updater: RetentionUserEmailUpdater) {}

	async on(event: UserEmailUpdatedDomainEvent): Promise<void> {
		await this.updater.update(event.id, event.email);
	}

	subscribedTo(): DomainEventClass[] {
		return [UserEmailUpdatedDomainEvent];
	}

	name(): string {
		return "codely.retention.create_retention_user_on_user_registered";
	}
}
