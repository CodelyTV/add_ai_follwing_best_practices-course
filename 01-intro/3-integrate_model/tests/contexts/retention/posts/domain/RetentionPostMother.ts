import { Primitives } from "@codelytv/primitives-type";

import { RetentionPost } from "../../../../../src/contexts/retention/posts/domain/RetentionPost";
import { PostIdMother } from "../../../rrss/posts/domain/PostIdMother";
import { UserIdMother } from "../../../rrss/users/domain/UserIdMother";

export class RetentionPostMother {
	static create(params?: Partial<Primitives<RetentionPost>>): RetentionPost {
		const primitives: Primitives<RetentionPost> = {
			id: PostIdMother.create().value,
			userId: UserIdMother.create().value,
			...params,
		};

		return RetentionPost.fromPrimitives(primitives);
	}
}
