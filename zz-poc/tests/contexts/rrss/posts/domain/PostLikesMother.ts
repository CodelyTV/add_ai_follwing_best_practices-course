import { faker } from "@faker-js/faker";

import { PostTotalLikes } from "../../../../../src/contexts/rrss/posts/domain/PostTotalLikes";

export class PostLikesMother {
	static create(value?: number): PostTotalLikes {
		return new PostTotalLikes(value ?? faker.number.int({ min: 0, max: 10000000 }));
	}
}
