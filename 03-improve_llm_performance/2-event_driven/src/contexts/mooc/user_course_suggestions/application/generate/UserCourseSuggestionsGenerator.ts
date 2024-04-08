import { EventBus } from "../../../../shared/domain/event/EventBus";
import { UserId } from "../../../users/domain/UserId";
import { CourseSuggestionsGenerator } from "../../domain/CourseSuggestionsGenerator";
import { UserCourseSuggestions } from "../../domain/UserCourseSuggestions";
import { UserCourseSuggestionsRepository } from "../../domain/UserCourseSuggestionsRepository";

export class UserCourseSuggestionsGenerator {
	constructor(
		private readonly repository: UserCourseSuggestionsRepository,
		private readonly generator: CourseSuggestionsGenerator,
		private readonly eventBus: EventBus,
	) {}

	async generate(userId: string, courseName: string): Promise<void> {
		const userCourseSuggestions =
			(await this.repository.search(new UserId(userId))) ?? UserCourseSuggestions.create(userId);

		if (!userCourseSuggestions.hasCompleted(courseName)) {
			userCourseSuggestions.addCompletedCourse(courseName);

			const suggestions = await this.generator.generate(userCourseSuggestions);

			userCourseSuggestions.updateSuggestions(suggestions);

			await this.repository.save(userCourseSuggestions);
			await this.eventBus.publish(userCourseSuggestions.pullDomainEvents());
		}
	}
}
