import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UserCourseSuggestionsGenerated } from "./UserCourseSuggestionsGenerated";

export class UserCourseSuggestions extends AggregateRoot {
	constructor(
		public readonly userId: string,
		public completedCourses: string[],
		public suggestions: string,
	) {
		super();
	}

	static create(userId: string): UserCourseSuggestions {
		return new UserCourseSuggestions(userId, [], "");
	}

	addCompletedCourse(courseName: string): void {
		this.completedCourses.push(courseName);
	}

	updateSuggestions(suggestions: string): void {
		this.suggestions = suggestions;

		this.record(new UserCourseSuggestionsGenerated(this.userId, suggestions));
	}
}
