export type CourseSuggestionPrimitives = {
	courseName: string;
	reason: string;
};

export class CourseSuggestion {
	constructor(
		private readonly courseName: string,
		private readonly suggestionReason: string,
	) {}

	toPrimitives(): CourseSuggestionPrimitives {
		return {
			courseName: this.courseName,
			reason: this.suggestionReason,
		};
	}
}
