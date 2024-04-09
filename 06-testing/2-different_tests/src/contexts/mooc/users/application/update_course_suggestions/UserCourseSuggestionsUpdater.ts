import { UserFinder } from "../../domain/UserFinder";
import { UserRepository } from "../../domain/UserRepository";

export class UserCourseSuggestionsUpdater {
	constructor(
		private readonly finder: UserFinder,
		private readonly repository: UserRepository,
	) {}

	async update(userId: string, suggestedCourses: string): Promise<void> {
		const user = await this.finder.find(userId);

		user.updateSuggestedCourses(suggestedCourses);

		await this.repository.save(user);
	}
}
