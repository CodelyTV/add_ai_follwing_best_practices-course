import { OllamaMistralCourseSuggestionsGenerator } from "../../../../../src/contexts/mooc/user_course_suggestions/infrastructure/OllamaMistralCourseSuggestionsGenerator";
import { CriteriaMother } from "../../../shared/domain/criteria/CriteriaMother";

describe("OllamaMistralCourseSuggestionsGenerator should", () => {
	const generator = new OllamaMistralCourseSuggestionsGenerator();

	it("suggest existing courses", async () => {
		const user = UserMother.create();

		await repository.save(user);
	});

	it("suggest meaningful courses", async () => {
		const userId = UserIdMother.create();

		expect(await repository.search(userId)).toBeNull();
	});

});
