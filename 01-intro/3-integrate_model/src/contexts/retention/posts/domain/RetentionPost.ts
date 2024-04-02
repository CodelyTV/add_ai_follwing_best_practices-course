import { Primitives } from "@codelytv/primitives-type";

import { PostId } from "../../../rrss/posts/domain/PostId";
import { UserId } from "../../../rrss/users/domain/UserId";
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

export class RetentionPost extends AggregateRoot {
	private constructor(
		public readonly id: PostId,
		public readonly userId: UserId,
	) {
		super();
	}

	static create(id: string, userId: string): RetentionPost {
		return new RetentionPost(new PostId(id), new UserId(userId));
	}

	static fromPrimitives(primitives: Primitives<RetentionPost>): RetentionPost {
		return new RetentionPost(new PostId(primitives.id), new UserId(primitives.userId));
	}

	toPrimitives(): Primitives<RetentionPost> {
		return {
			id: this.id.value,
			userId: this.userId.value,
		};
	}
}
