import { CourseSuggestion } from "./CourseSuggestion";

export interface CoursesSuggestionModel {
	predict(interests: string[]): Promise<CourseSuggestion[]>;
}
