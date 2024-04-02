import { UserFinder } from "../../../../rrss/users/application/find/UserFinder";
import { CoursesSuggestionLlm } from "../../domain/CoursesSuggestionLlm";
import { CourseSuggestion } from "../../domain/CourseSuggestion";

export class CourseSuggestionsPredictor {
	constructor(
		private readonly userFinder: UserFinder,
		private readonly model: CoursesSuggestionLlm,
	) {}

	async predict(userId: string): Promise<CourseSuggestion[]> {
		const user = await this.userFinder.find(userId);

		return await this.model.predict(user.interests);
	}
}
