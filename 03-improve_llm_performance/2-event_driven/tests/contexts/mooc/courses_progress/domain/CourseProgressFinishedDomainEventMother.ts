import {
	CourseProgressFinishedDomainEvent,
	CourseProgressFinishedDomainEventPrimitives,
} from "../../../../../src/contexts/courses_progress/domain/CourseProgressFinishedDomainEvent";
import { UserIdMother } from "../../users/domain/UserIdMother";
import { UserNameMother } from "../../users/domain/UserNameMother";

export class CourseProgressFinishedDomainEventMother {
	static create(
		params?: Partial<CourseProgressFinishedDomainEventPrimitives>,
	): CourseProgressFinishedDomainEvent {
		const primitives: CourseProgressFinishedDomainEventPrimitives = {
			id: UserIdMother.create().value,
			courseName: UserNameMother.create().value,
			userId: UserIdMother.create().value,
			...params,
		};

		return new CourseProgressFinishedDomainEvent(
			primitives.id,
			primitives.courseName,
			primitives.userId,
		);
	}
}
