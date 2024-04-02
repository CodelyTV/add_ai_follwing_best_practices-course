import { DomainEvent, DomainEventAttributes } from "../../../shared/domain/event/DomainEvent";

export type PostLikesIncrementedDomainEventPrimitives = {
	id: string;
	likes: number;
};

export class PostLikesIncrementedDomainEvent extends DomainEvent {
	static eventName = "codely.rrss.post.likes.incremented";

	constructor(
		public readonly id: string,
		public readonly likes: number,
		eventId?: string,
		occurredOn?: Date,
	) {
		super(PostLikesIncrementedDomainEvent.eventName, id, eventId, occurredOn);
	}

	static fromPrimitives(
		aggregateId: string,
		eventId: string,
		occurredOn: Date,
		attributes: DomainEventAttributes,
	): PostLikesIncrementedDomainEvent {
		return new PostLikesIncrementedDomainEvent(
			aggregateId,
			attributes.likes as number,
			eventId,
			occurredOn,
		);
	}

	toPrimitives(): PostLikesIncrementedDomainEventPrimitives {
		return {
			id: this.id,
			likes: this.likes,
		};
	}
}
