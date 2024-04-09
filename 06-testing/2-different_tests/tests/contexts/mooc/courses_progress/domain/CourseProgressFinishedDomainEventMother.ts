import {
	CourseProgressCompletedDomainEventPrimitives,
	UserCourseProgressCompletedDomainEvent,
} from "../../../../../src/contexts/mooc/user_course_progress/domain/UserCourseProgressCompletedDomainEvent";
import { UserIdMother } from "../../users/domain/UserIdMother";
import { UserNameMother } from "../../users/domain/UserNameMother";

export class CourseProgressCompletedDomainEventMother {
	static create(
		params?: Partial<CourseProgressCompletedDomainEventPrimitives>,
	): UserCourseProgressCompletedDomainEvent {
		const primitives: CourseProgressCompletedDomainEventPrimitives = {
			id: UserIdMother.create().value,
			courseName: UserNameMother.create().value,
			userId: UserIdMother.create().value,
			...params,
		};

		return new UserCourseProgressCompletedDomainEvent(
			primitives.id,
			primitives.courseName,
			primitives.userId,
		);
	}
}
