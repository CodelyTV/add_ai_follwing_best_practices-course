import { DomainEvent, DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

export type CourseProgressCompletedDomainEventPrimitives = {
	id: string;
	courseName: string;
	userId: string;
};

export class CourseProgressCompletedDomainEvent extends DomainEvent {
	static eventName = "codely.mooc.course_progress.completed";

	constructor(
		public readonly id: string,
		public readonly courseName: string,
		public readonly userId: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(CourseProgressCompletedDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	): CourseProgressCompletedDomainEvent {
		return new CourseProgressCompletedDomainEvent(
			aggregateId,
			attributes.courseName as string,
			attributes.userId as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): CourseProgressCompletedDomainEventPrimitives {
		return {
			id: this.id,
			courseName: this.courseName,
			userId: this.userId,
		};
	}
}
