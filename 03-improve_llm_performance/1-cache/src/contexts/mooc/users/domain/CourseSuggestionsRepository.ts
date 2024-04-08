export interface CourseSuggestionsRepository {
	search(finishedCourses: string[]): Promise<string>;
}
