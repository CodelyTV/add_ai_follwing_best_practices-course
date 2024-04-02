import { DomainEvent, DomainEventAttributes } from "../../shared/domain/event/DomainEvent";

export class CourseProgressFinishedDomainEvent extends DomainEvent {
	static eventName = "codely.mooc.course_progress.finished";

	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly userId: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(CourseProgressFinishedDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	): CourseProgressFinishedDomainEvent {
		return new CourseProgressFinishedDomainEvent(
			aggregateId,
			attributes.name as string,
			attributes.userId as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): DomainEventAttributes {
		return {
			id: this.id,
			name: this.name,
			userId: this.userId,
		};
	}
}
