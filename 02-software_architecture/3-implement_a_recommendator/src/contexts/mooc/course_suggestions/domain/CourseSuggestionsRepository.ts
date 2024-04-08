export interface CourseSuggestionsRepository {
	byFinishedCourses(finishedCourses: string[]): Promise<string>;
}
