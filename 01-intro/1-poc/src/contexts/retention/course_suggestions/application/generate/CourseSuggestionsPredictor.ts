import { UserFinder } from "../../../../rrss/users/application/find/UserFinder";
import { CoursesSuggestionModel } from "../../domain/CoursesSuggestionModel";
import { CourseSuggestion } from "../../domain/CourseSuggestion";

export class CourseSuggestionsPredictor {
	constructor(
		private readonly userFinder: UserFinder,
		private readonly model: CoursesSuggestionModel,
	) {}

	async predict(userId: string): Promise<CourseSuggestion[]> {
		const user = await this.userFinder.find(userId);

		return await this.model.predict(user.interests);
	}
}
