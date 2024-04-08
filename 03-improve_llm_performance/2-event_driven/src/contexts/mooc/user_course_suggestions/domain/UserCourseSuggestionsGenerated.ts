import { DomainEvent, DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

export type UserCourseSuggestionsGeneratedDomainEventPrimitives = {
	userId: string;
	suggestions: string;
};

export class UserCourseSuggestionsGenerated extends DomainEvent {
	static eventName = "codely.mooc.user_course_suggestions.generated";

	constructor(
		public readonly userId: string,
		public readonly suggestions: string,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(UserCourseSuggestionsGenerated.eventName, userId, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	): UserCourseSuggestionsGenerated {
		return new UserCourseSuggestionsGenerated(
			aggregateId,
			attributes.suggestions as string,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): UserCourseSuggestionsGeneratedDomainEventPrimitives {
		return {
			userId: this.userId,
			suggestions: this.suggestions,
		};
	}
}
