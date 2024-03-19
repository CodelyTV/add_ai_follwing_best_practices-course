import { DomainEvent, DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

export class UserDomainEvent extends DomainEvent {
	static eventName = "codely.rrss.user.*";

	constructor(
		eventName: string,
		public readonly id: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		_attributes: DomainEventAttributes,
	): UserDomainEvent {
		return new UserDomainEvent(UserDomainEvent.eventName, aggregateId, eventId, occurredOn);
	}

	toPrimitives(): { [key: string]: unknown } {
		return {
			id: this.id,
		};
	}
}
