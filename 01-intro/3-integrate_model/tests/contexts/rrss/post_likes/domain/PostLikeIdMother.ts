import { faker } from "@faker-js/faker";

import { PostLikeId } from "../../../../../src/contexts/rrss/post_likes/domain/PostLikeId";

export class PostLikeIdMother {
	static create(value?: string): PostLikeId {
		return new PostLikeId(value ?? faker.string.uuid());
	}
}
