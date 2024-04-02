import { Primitives } from "@codelytv/primitives-type";

import { PostLike } from "../../../../../src/contexts/rrss/post_likes/domain/PostLike";
import { PostLikedDomainEvent } from "../../../../../src/contexts/rrss/post_likes/domain/PostLikedDomainEvent";
import { PostIdMother } from "../../posts/domain/PostIdMother";
import { UserIdMother } from "../../users/domain/UserIdMother";
import { PostLikeIdMother } from "./PostLikeIdMother";

export class PostLikedDomainEventMother {
	static create(params?: Partial<Primitives<PostLike>>): PostLikedDomainEvent {
		const primitives: Primitives<PostLike> = {
			id: PostLikeIdMother.create().value,
			postId: PostIdMother.create().value,
			userId: UserIdMother.create().value,
			likedAt: new Date(),
			...params,
		};

		return new PostLikedDomainEvent(primitives.id, primitives.postId, primitives.userId);
	}
}
