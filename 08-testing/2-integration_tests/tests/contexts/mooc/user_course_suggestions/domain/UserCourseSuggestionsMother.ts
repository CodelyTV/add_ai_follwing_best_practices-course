import { faker } from "@faker-js/faker";

import {
	UserCourseSuggestions,
	UserCourseSuggestionsPrimitives,
} from "../../../../../src/contexts/mooc/user_course_suggestions/domain/UserCourseSuggestions";
import { UserIdMother } from "../../users/domain/UserIdMother";
import { CourseSuggestionMother } from "./CourseSuggestionMother";

export class UserCourseSuggestionsMother {
	static create(params?: Partial<UserCourseSuggestionsPrimitives>): UserCourseSuggestions {
		const primitives: UserCourseSuggestionsPrimitives = {
			userId: UserIdMother.create().value,
			completedCourses: faker.helpers.multiple(() => faker.string.alpha(50), {
				count: {
					min: 1,
					max: 5,
				},
			}),
			suggestions: faker.helpers.multiple(() => CourseSuggestionMother.create(), { count: 3 }),
			...params,
		};

		return UserCourseSuggestions.fromPrimitives(primitives);
	}

	static withoutSuggestions(completedCourses: string[]): UserCourseSuggestions {
		return this.create({ suggestions: [], completedCourses });
	}
}
