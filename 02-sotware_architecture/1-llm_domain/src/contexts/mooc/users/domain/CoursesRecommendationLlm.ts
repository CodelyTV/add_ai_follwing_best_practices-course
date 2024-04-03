export interface CoursesRecommendationLlm {
	predict(finishedCourses: string[]): Promise<string>;
}
