export interface UserCourseSuggestionsRepository {
	byCompletedCourses(finishedCourses: string[]): Promise<string>;
}
