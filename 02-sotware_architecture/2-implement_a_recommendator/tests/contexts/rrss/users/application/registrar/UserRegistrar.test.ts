import { UserRegistrar } from "../../../../../../src/contexts/rrss/users/application/registrar/UserRegistrar";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { UserMother } from "../../domain/UserMother";
import { UserRegisteredDomainEventMother } from "../../domain/UserRegisteredDomainEventMother";
import { MockUserRepository } from "../../infrastructure/MockUserRepository";

describe("UserRegistrar should", () => {
	const repository = new MockUserRepository();
	const eventBus = new MockEventBus();
	const userRegistrar = new UserRegistrar(repository, eventBus);

	it("register a valid user", async () => {
		const expectedUser = UserMother.create();
		const expectedUserPrimitives = expectedUser.toPrimitives();

		const expectedDomainEvent = UserRegisteredDomainEventMother.create(expectedUserPrimitives);

		repository.shouldSave(expectedUser);
		eventBus.shouldPublish([expectedDomainEvent]);

		await userRegistrar.registrar(
			expectedUserPrimitives.id,
			expectedUserPrimitives.name,
			expectedUserPrimitives.email,
			expectedUserPrimitives.profilePicture,
		);
	});
});
