import { CourseSuggestion } from "./CourseSuggestion";
import { UserCourseSuggestions } from "./UserCourseSuggestions";

export interface CourseSuggestionsGenerator {
	generate(userCourseSuggestions: UserCourseSuggestions): Promise<CourseSuggestion[]>;
}
