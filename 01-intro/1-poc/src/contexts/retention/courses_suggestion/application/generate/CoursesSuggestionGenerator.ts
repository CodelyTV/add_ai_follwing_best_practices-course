import { UserFinder } from "../../../../rrss/users/application/find/UserFinder";
import { CoursesSuggestionModel } from "../../domain/CoursesSuggestionModel";
import { CourseSuggestion } from "../../domain/CourseSuggestion";

export class CoursesSuggestionGenerator {
	constructor(
		private readonly userFinder: UserFinder,
		private readonly model: CoursesSuggestionModel,
	) {}

	async generate(userId: string): Promise<CourseSuggestion[]> {
		const user = await this.userFinder.find(userId);

		return await this.model.predict(user.interests);
	}
}
