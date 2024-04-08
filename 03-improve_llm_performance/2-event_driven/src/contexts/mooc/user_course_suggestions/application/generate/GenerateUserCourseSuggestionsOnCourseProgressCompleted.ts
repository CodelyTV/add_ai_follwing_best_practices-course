import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { CourseProgressCompletedDomainEvent } from "../../../courses_progress/domain/CourseProgressCompletedDomainEvent";
import { UserCourseSuggestionsGenerator } from "./UserCourseSuggestionsGenerator";

export class GenerateUserCourseSuggestionsOnCourseProgressCompleted
	implements DomainEventSubscriber<CourseProgressCompletedDomainEvent>
{
	constructor(private readonly generator: UserCourseSuggestionsGenerator) {}

	async on(event: CourseProgressCompletedDomainEvent): Promise<void> {
		await this.generator.generate(event.userId, event.courseName);
	}

	subscribedTo(): DomainEventClass[] {
		return [CourseProgressCompletedDomainEvent];
	}

	name(): string {
		return "codely.mooc.generate_course_suggestions_on_course_progress_completed";
	}
}
