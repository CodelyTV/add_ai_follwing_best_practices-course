import { CourseProgressFinishedDomainEvent } from "../../../../course_progress/domain/CourseProgressFinishedDomainEvent";
import { DomainEventClass } from "../../../../shared/domain/event/DomainEventClass";
import { DomainEventSubscriber } from "../../../../shared/domain/event/DomainEventSubscriber";
import { RecommendedCoursesUpdater } from "./RecommendedCoursesUpdater";

export class UpdateRecommendedCoursesOnCourseProgressFinishedDomainEvent
	implements DomainEventSubscriber<CourseProgressFinishedDomainEvent>
{
	constructor(private readonly updater: RecommendedCoursesUpdater) {}

	async on(event: CourseProgressFinishedDomainEvent): Promise<void> {
		await this.updater.update(event.userId, event.name);
	}

	subscribedTo(): DomainEventClass[] {
		return [CourseProgressFinishedDomainEvent];
	}

	name(): string {
		return "codely.mooc.update_recommended_courses_on_course_progress_finished_domain_event";
	}
}
