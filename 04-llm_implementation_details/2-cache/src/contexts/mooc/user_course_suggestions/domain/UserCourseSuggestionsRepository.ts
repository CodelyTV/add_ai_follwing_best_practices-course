export interface UserCourseSuggestionsRepository {
	byCompletedCourses(completedCourses: string[]): Promise<string>;
}
