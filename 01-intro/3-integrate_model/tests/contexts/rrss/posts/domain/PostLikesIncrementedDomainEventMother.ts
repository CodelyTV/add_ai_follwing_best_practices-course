import {
	PostLikesIncrementedDomainEvent,
	PostLikesIncrementedDomainEventPrimitives,
} from "../../../../../src/contexts/rrss/posts/domain/PostLikesIncrementedDomainEvent";
import { PostIdMother } from "./PostIdMother";
import { PostLikesMother } from "./PostLikesMother";

export class PostLikesIncrementedDomainEventMother {
	static create(
		params?: Partial<PostLikesIncrementedDomainEventPrimitives>,
	): PostLikesIncrementedDomainEvent {
		const primitives: PostLikesIncrementedDomainEventPrimitives = {
			id: PostIdMother.create().value,
			likes: PostLikesMother.create().value,
			...params,
		};

		return new PostLikesIncrementedDomainEvent(primitives.id, primitives.likes);
	}
}
