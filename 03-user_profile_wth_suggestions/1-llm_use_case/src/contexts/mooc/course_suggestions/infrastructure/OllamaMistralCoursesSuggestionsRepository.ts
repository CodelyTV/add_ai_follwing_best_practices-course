import { CourseSuggestionsRepository } from "../domain/CourseSuggestionsRepository";

export class OllamaMistralCoursesSuggestionsRepository implements CourseSuggestionsRepository {
	async byFinishedCourses(_finishedCourses: string[]): Promise<string> {
		return Promise.resolve("");
	}
}
