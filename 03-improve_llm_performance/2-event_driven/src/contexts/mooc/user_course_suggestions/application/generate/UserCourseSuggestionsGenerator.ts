import { EventBus } from "../../../../shared/domain/event/EventBus";
import { UserId } from "../../../users/domain/UserId";
import { CourseSuggestionsGenerator } from "../../domain/CourseSuggestionsGenerator";
import { CourseSuggestionsRepository } from "../../domain/CourseSuggestionsRepository";
import { UserCourseSuggestions } from "../../domain/UserCourseSuggestions";

export class UserCourseSuggestionsGenerator {
	constructor(
		private readonly repository: CourseSuggestionsRepository,
		private readonly generator: CourseSuggestionsGenerator,
		private readonly eventBus: EventBus,
	) {}

	async generate(userId: string, courseName: string): Promise<void> {
		const userCourseSuggestions =
			(await this.repository.search(new UserId(userId))) ?? UserCourseSuggestions.create(userId);

		userCourseSuggestions.addCompletedCourse(courseName);

		const suggestions = await this.generator.generate(userCourseSuggestions.completedCourses);

		userCourseSuggestions.updateSuggestions(suggestions);

		await this.repository.save(userCourseSuggestions);
		await this.eventBus.publish(userCourseSuggestions.pullDomainEvents());
	}
}
