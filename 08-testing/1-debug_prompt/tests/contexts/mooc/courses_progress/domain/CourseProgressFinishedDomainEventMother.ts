import {
	CourseProgressCompletedDomainEvent,
	CourseProgressCompletedDomainEventPrimitives,
} from "../../../../../src/contexts/mooc/courses_progress/domain/CourseProgressCompletedDomainEvent";
import { UserIdMother } from "../../users/domain/UserIdMother";
import { UserNameMother } from "../../users/domain/UserNameMother";

export class CourseProgressCompletedDomainEventMother {
	static create(
		params?: Partial<CourseProgressCompletedDomainEventPrimitives>,
	): CourseProgressCompletedDomainEvent {
		const primitives: CourseProgressCompletedDomainEventPrimitives = {
			id: UserIdMother.create().value,
			courseName: UserNameMother.create().value,
			userId: UserIdMother.create().value,
			...params,
		};

		return new CourseProgressCompletedDomainEvent(
			primitives.id,
			primitives.courseName,
			primitives.userId,
		);
	}
}
