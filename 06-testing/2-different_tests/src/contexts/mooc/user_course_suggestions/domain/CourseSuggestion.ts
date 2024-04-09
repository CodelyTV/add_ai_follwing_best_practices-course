export type CourseSuggestionPrimitives = {
	courseName: string;
	suggestionReason: string;
};

export class CourseSuggestion {
	constructor(
		public readonly courseName: string,
		public readonly suggestionReason: string,
	) {}

	static fromPrimitives(primitives: CourseSuggestionPrimitives): CourseSuggestion {
		return new CourseSuggestion(primitives.courseName, primitives.suggestionReason);
	}

	toPrimitives(): CourseSuggestionPrimitives {
		return {
			courseName: this.courseName,
			suggestionReason: this.suggestionReason,
		};
	}
}
