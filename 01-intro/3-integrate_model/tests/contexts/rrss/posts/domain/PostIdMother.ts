import { faker } from "@faker-js/faker";

import { PostId } from "../../../../../src/contexts/rrss/posts/domain/PostId";

export class PostIdMother {
	static create(value?: string): PostId {
		return new PostId(value ?? faker.string.uuid());
	}
}
