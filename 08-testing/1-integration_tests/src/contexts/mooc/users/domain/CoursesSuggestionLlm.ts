export interface CoursesSuggestionLlm {
	predict(finishedCourses: string[]): Promise<string>;
}
