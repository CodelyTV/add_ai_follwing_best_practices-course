import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { UserCourseSuggestionsGenerated } from "../../../user_course_suggestions/domain/UserCourseSuggestionsGenerated";
import { UserCourseSuggestionsGenerator } from "./UserCourseSuggestionsGenerator";

export class UpdateUserCourseSuggestionsOnUserCourseSuggestionsGenerated
	implements DomainEventSubscriber<UserCourseSuggestionsGenerated>
{
	constructor(private readonly generator: UserCourseSuggestionsGenerator) {}

	async on(event: UserCourseSuggestionsGenerated): Promise<void> {
		await this.generator.update(event.userId, event.suggestions);
	}

	subscribedTo(): DomainEventClass[] {
		return [UserCourseSuggestionsGenerated];
	}

	name(): string {
		return "codely.mooc.update_user_course_suggestions_on_user_course_suggestions_generated";
	}
}
