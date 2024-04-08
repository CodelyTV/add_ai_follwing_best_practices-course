import { UserId } from "../../users/domain/UserId";
import { UserCourseSuggestions } from "./UserCourseSuggestions";

export interface CourseSuggestionsRepository {
	save(suggestions: UserCourseSuggestions): Promise<void>;

	search(userId: UserId): Promise<UserCourseSuggestions | null>;
}
