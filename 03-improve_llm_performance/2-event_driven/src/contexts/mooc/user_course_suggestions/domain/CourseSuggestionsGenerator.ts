export interface CourseSuggestionsGenerator {
	generate(courses: string[]): Promise<string>;
}
