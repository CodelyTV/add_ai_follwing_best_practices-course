import { DomainEvent, DomainEventAttributes } from "../../shared/domain/event/DomainEvent";

export type CourseProgressFinishedDomainEventPrimitives = {
	id: string;
	courseName: string;
	userId: string;
};

export class CourseProgressFinishedDomainEvent extends DomainEvent {
	static eventName = "codely.mooc.course_progress.finished";

	constructor(
		public readonly id: string,
		public readonly courseName: string,
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
			attributes.courseName as string,
			attributes.userId as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): CourseProgressFinishedDomainEventPrimitives {
		return {
			id: this.id,
			courseName: this.courseName,
			userId: this.userId,
		};
	}
}
