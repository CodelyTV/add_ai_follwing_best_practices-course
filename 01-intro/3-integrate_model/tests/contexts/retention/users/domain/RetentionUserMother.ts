import { faker } from "@faker-js/faker";

import {
	RetentionUser,
	RetentionUserPrimitives,
} from "../../../../../src/contexts/retention/users/domain/RetentionUser";
import { UserIdMother } from "../../../rrss/users/domain/UserIdMother";

export class RetentionUserMother {
	static create(params?: Partial<RetentionUserPrimitives>): RetentionUser {
		const primitives: RetentionUserPrimitives = {
			id: UserIdMother.create().value,
			email: faker.internet.email(),
			name: faker.person.fullName(),
			totalPosts: faker.number.int({ min: 0, max: 100 }),
			averagePostLikes: faker.number.int({ min: 0, max: 100 }),
			...params,
		};

		return RetentionUser.fromPrimitives(primitives);
	}

	static withoutPosts(params?: Partial<RetentionUserPrimitives>): RetentionUser {
		const primitives: RetentionUserPrimitives = {
			id: UserIdMother.create().value,
			email: faker.internet.email(),
			name: faker.person.fullName(),
			totalPosts: 0,
			averagePostLikes: 0,
			...params,
		};

		return this.create(primitives);
	}
}
