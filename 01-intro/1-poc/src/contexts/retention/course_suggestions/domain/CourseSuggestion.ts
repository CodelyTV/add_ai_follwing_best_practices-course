export type CourseSuggestionPrimitives = {
	courseName: string;
	reason: string;
	coveredInterests: string[];
};

export class CourseSuggestion {
	constructor(
		private readonly courseName: string,
		private readonly suggestionReason: string,
		private readonly coveredInterests: string[],
	) {}

	toPrimitives(): CourseSuggestionPrimitives {
		return {
			courseName: this.courseName,
			reason: this.suggestionReason,
			coveredInterests: this.coveredInterests,
		};
	}
}
