import { CreateRetentionUserOnUserRegistered } from "../../../../../../src/contexts/retention/users/application/create/CreateRetentionUserOnUserRegistered";
import { RetentionUserCreator } from "../../../../../../src/contexts/retention/users/application/create/RetentionUserCreator";
import { UserIdMother } from "../../../../rrss/users/domain/UserIdMother";
import { UserRegisteredDomainEventMother } from "../../../../rrss/users/domain/UserRegisteredDomainEventMother";
import { RetentionUserMother } from "../../domain/RetentionUserMother";
import { MockRetentionUserRepository } from "../../infrastructure/MockRetentionUserRepository";

describe("CreateRetentionUserOnUserRegistered should", () => {
	const repository = new MockRetentionUserRepository();
	const subscriber = new CreateRetentionUserOnUserRegistered(new RetentionUserCreator(repository));

	it("not create a retention user if already exist", async () => {
		const event = UserRegisteredDomainEventMother.create();
		const userId = UserIdMother.create(event.id);

		repository.shouldSearch(RetentionUserMother.create({ id: userId.value }));

		await subscriber.on(event);
	});

	it("create a new retention user", async () => {
		const event = UserRegisteredDomainEventMother.create();
		const userId = UserIdMother.create(event.id);

		const user = RetentionUserMother.withoutPosts({
			id: event.id,
			email: event.email,
			name: event.name,
		});

		repository.shouldSearchAndReturnNull(userId);
		repository.shouldSave(user);

		await subscriber.on(event);
	});
});
