import { jest } from "@jest/globals";

import { CoursesSuggestionLlm } from "../../../../../src/contexts/mooc/users/domain/CoursesSuggestionLlm";

export class MockCoursesSuggestionLlm implements CoursesSuggestionLlm {
	private readonly mockPredict = jest.fn();

	async predict(finishedCourses: string[]): Promise<string> {
		expect(this.mockPredict).toHaveBeenCalledWith(finishedCourses);

		return this.mockPredict() as Promise<string>;
	}

	shouldPredict(finishedCourses: string[], recommendedCourses: string): void {
		this.mockPredict(finishedCourses);
		this.mockPredict.mockReturnValueOnce(recommendedCourses);
	}
}
