import { faker } from "@faker-js/faker";

import {
	CourseSuggestion,
	CourseSuggestionPrimitives,
} from "../../../../../src/contexts/mooc/user_course_suggestions/domain/CourseSuggestion";

export class CourseSuggestionMother {
	static create(params?: Partial<CourseSuggestionPrimitives>): CourseSuggestion {
		const primitives: CourseSuggestionPrimitives = {
			courseName: faker.string.alpha(50),
			suggestionReason: faker.string.alpha(150),
			...params,
		};

		return CourseSuggestion.fromPrimitives(primitives);
	}
}
