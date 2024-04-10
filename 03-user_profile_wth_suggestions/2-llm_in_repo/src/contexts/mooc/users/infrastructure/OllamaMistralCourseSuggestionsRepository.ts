import { CourseSuggestionsRepository } from "../../course_suggestions/domain/CourseSuggestionsRepository";

export class OllamaMistralCourseSuggestionsRepository implements CourseSuggestionsRepository {
	async byFinishedCourses(_finishedCourses: string[]): Promise<string> {
		return Promise.resolve("");
	}
}
