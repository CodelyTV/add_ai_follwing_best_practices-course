import {
	UserEmailUpdatedDomainEvent,
	UserEmailUpdatedDomainEventPrimitives,
} from "../../../../../src/contexts/rrss/users/domain/UserEmailUpdatedDomainEvent";
import { UserEmailMother } from "./UserEmailMother";
import { UserIdMother } from "./UserIdMother";

export class UserEmailUpdatedDomainEventMother {
	static create(
		params?: Partial<UserEmailUpdatedDomainEventPrimitives>,
	): UserEmailUpdatedDomainEvent {
		const primitives = {
			id: UserIdMother.create().value,
			email: UserEmailMother.create().value,
			...params,
		};

		return new UserEmailUpdatedDomainEvent(primitives.id, primitives.email);
	}
}
