import { CourseSuggestion } from "./CourseSuggestion";

export interface CoursesSuggestionLlm {
	predict(interests: string[]): Promise<CourseSuggestion[]>;
}
