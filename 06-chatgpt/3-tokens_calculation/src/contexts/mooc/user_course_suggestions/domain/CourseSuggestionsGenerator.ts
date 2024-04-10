import { UserCourseSuggestions } from "./UserCourseSuggestions";

export interface CourseSuggestionsGenerator {
	generate(userCourseSuggestions: UserCourseSuggestions): Promise<string>;
}
