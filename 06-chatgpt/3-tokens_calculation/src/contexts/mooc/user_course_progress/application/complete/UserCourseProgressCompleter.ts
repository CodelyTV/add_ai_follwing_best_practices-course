import { EventBus } from "../../../../shared/domain/event/EventBus";
import { UserCourseProgressCompletedDomainEvent } from "../../domain/UserCourseProgressCompletedDomainEvent";

export class UserCourseProgressCompleter {
	constructor(private readonly eventBus: EventBus) {}

	async complete(courseId: string, userId: string, courseName: string): Promise<void> {
		await this.eventBus.publish([
			new UserCourseProgressCompletedDomainEvent(courseId, userId, courseName),
		]);
	}
}
