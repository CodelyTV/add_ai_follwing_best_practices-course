import { UserId } from "../../../users/domain/UserId";
import { UserCourseSuggestions } from "../../domain/UserCourseSuggestions";
import { UserCourseSuggestionsRepository } from "../../domain/UserCourseSuggestionsRepository";

export class UserCourseSuggestionsSearcher {
	constructor(private readonly repository: UserCourseSuggestionsRepository) {}

	async search(userId: string): Promise<UserCourseSuggestions | null> {
		return await this.repository.search(new UserId(userId));
	}
}
