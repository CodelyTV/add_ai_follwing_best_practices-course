import { faker } from "@faker-js/faker";
import { OpenAI } from "@langchain/openai";
import { loadEvaluator } from "langchain/evaluation";

import { CourseSuggestion } from "../../../../../src/contexts/mooc/user_course_suggestions/domain/CourseSuggestion";
import { OpenAIChatGPT35CourseSuggestionsGenerator } from "../../../../../src/contexts/mooc/user_course_suggestions/infrastructure/OpenAIChatGPT35CourseSuggestionsGenerator";
import { UserCourseSuggestionsMother } from "../domain/UserCourseSuggestionsMother";

describe("OpenAIChatGPT35CourseSuggestionsGenerator should", () => {
	const generator = new OpenAIChatGPT35CourseSuggestionsGenerator();

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

	it("suggest relevant courses", async () => {
		const suggestedCourseNames = suggestions.map((suggestion) => suggestion.courseName);

		const evaluator = await loadEvaluator("criteria", {
			criteria: "relevance",
			llm: new OpenAI({
				modelName: "gpt-3.5-turbo-0125",
				openAIApiKey: process.env.OPENAI_API_KEY,
			}),
		});

		const response = await evaluator.evaluateStrings({
			input: `Dado que hay estos cursos:
${formatList(generator.existingCodelyCourses)}
De la lista anterior, dame cursos recomendados para alguien que ha hecho estos:
${formatList(someExistingCourses)}
`,
			prediction: formatList(suggestedCourseNames),
		});

		expect(response.value).toEqual("Y");
	}, 30000);
});

function formatList(items: string[]): string {
	return items.map((name) => `- ${name}`).join(`\n`);
}
