import { UserId } from "../../users/domain/UserId";
import { UserCourseSuggestions } from "./UserCourseSuggestions";

export interface UserCourseSuggestionsRepository {
	search(userId: UserId): Promise<UserCourseSuggestions | null>;
}
