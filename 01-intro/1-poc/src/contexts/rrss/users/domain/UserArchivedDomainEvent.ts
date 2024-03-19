import { DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";
import { UserDomainEvent } from "./UserDomainEvent";

export class UserArchivedDomainEvent extends UserDomainEvent {
	static eventName = "codely.rrss.user.archived";

	constructor(
		public readonly id: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(UserArchivedDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		_attributes: DomainEventAttributes,
	): UserArchivedDomainEvent {
		return new UserArchivedDomainEvent(aggregateId, eventId, occurredOn);
	}

	toPrimitives(): DomainEventAttributes {
		return {
			id: this.id,
		};
	}
}
