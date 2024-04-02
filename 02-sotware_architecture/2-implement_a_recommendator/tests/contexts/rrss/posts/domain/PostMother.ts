import { Primitives } from "@codelytv/primitives-type";

import { Post } from "../../../../../src/contexts/rrss/posts/domain/Post";
import { UserIdMother } from "../../users/domain/UserIdMother";
import { PostContentMother } from "./PostContentMother";
import { PostIdMother } from "./PostIdMother";
import { PostLatestLikesMother } from "./PostLatestLikesMother";
import { PostLikesMother } from "./PostLikesMother";

export class PostMother {
	static create(params?: Partial<Primitives<Post>>): Post {
		const primitives: Primitives<Post> = {
			id: PostIdMother.create().value,
			userId: UserIdMother.create().value,
			content: PostContentMother.create().value,
			totalLikes: PostLikesMother.create().value,
			latestLikes: PostLatestLikesMother.empty().toPrimitives(),
			createdAt: new Date(),
			...params,
		};

		return Post.fromPrimitives(primitives);
	}
}
