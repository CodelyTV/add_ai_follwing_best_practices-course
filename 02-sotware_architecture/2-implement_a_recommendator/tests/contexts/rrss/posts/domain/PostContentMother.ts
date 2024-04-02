import { faker } from "@faker-js/faker";

import { PostContent } from "../../../../../src/contexts/rrss/posts/domain/PostContent";

export class PostContentMother {
	static create(value?: string): PostContent {
		return new PostContent(value ?? faker.string.alpha());
	}
}
