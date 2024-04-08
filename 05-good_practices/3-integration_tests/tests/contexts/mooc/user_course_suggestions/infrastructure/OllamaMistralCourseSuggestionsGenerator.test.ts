import { faker } from "@faker-js/faker";

import { CourseSuggestion } from "../../../../../src/contexts/mooc/user_course_suggestions/domain/CourseSuggestion";
import { OllamaMistralCourseSuggestionsGenerator } from "../../../../../src/contexts/mooc/user_course_suggestions/infrastructure/OllamaMistralCourseSuggestionsGenerator";
import { UserCourseSuggestionsMother } from "../domain/UserCourseSuggestionsMother";

describe("OllamaMistralCourseSuggestionsGenerator should", () => {
	const generator = new OllamaMistralCourseSuggestionsGenerator();

	let suggestions: CourseSuggestion[];
	const someExistingCourses = faker.helpers.arrayElements(generator.existingCodelyCourses, 4);

	beforeAll(async () => {
		suggestions = await generator.generate(
			UserCourseSuggestionsMother.withoutSuggestions(someExistingCourses),
		);
	}, 30000);

	it("suggest only 3 courses", () => {
		expect(suggestions.length).toBe(3);
	});

	it("suggest only existing courses", () => {
		const suggestedCourseNames = suggestions.map((suggestion) => suggestion.courseName);

		expect(generator.existingCodelyCourses).toEqual(expect.arrayContaining(suggestedCourseNames));
	});

	it("suggest only courses that have not been completed", () => {
		const suggestedCourseNames = suggestions.map((suggestion) => suggestion.courseName);

		expect(someExistingCourses).not.toEqual(expect.arrayContaining(suggestedCourseNames));
	});
});
