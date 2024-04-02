import { Primitives } from "@codelytv/primitives-type";

import { PostLike } from "../../../../../src/contexts/rrss/post_likes/domain/PostLike";
import { PostIdMother } from "../../posts/domain/PostIdMother";
import { UserIdMother } from "../../users/domain/UserIdMother";
import { PostLikeIdMother } from "./PostLikeIdMother";

export class PostLikeMother {
	static create(params?: Partial<Primitives<PostLike>>): PostLike {
		const primitives: Primitives<PostLike> = {
			id: PostLikeIdMother.create().value,
			postId: PostIdMother.create().value,
			userId: UserIdMother.create().value,
			likedAt: new Date(),
			...params,
		};

		return PostLike.fromPrimitives(primitives);
	}
}
