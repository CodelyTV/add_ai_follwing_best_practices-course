import { AggregateRoot } from "../../../shared/domain/AggregateRoot";

export type UserCourseSuggestionsPrimitives = {
	userId: string;
	completedCourses: string[];
	suggestions: string;
};

export class UserCourseSuggestions extends AggregateRoot {
	constructor(
		public readonly userId: string,
		public completedCourses: string[],
		public suggestions: string,
	) {
		super();
	}

	static fromPrimitives(primitives: UserCourseSuggestionsPrimitives): UserCourseSuggestions {
		return new UserCourseSuggestions(
			primitives.userId,
			primitives.completedCourses,
			primitives.suggestions,
		);
	}

	static create(userId: string): UserCourseSuggestions {
		return new UserCourseSuggestions(userId, [], "");
	}

	addCompletedCourse(courseName: string): void {
		this.completedCourses.push(courseName);
	}

	toPrimitives(): UserCourseSuggestionsPrimitives {
		return {
			userId: this.userId,
			completedCourses: this.completedCourses,
			suggestions: this.suggestions,
		};
	}

	hasCompleted(courseName: string): boolean {
		return this.completedCourses.includes(courseName);
	}
}
