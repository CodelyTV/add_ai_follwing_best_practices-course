import { RetentionUserEmailUpdater } from "../../../../../../src/contexts/retention/users/application/update_email/RetentionUserEmailUpdater";
import { UpdateRetentionUserEmailOnUserEmailUpdated } from "../../../../../../src/contexts/retention/users/application/update_email/UpdateRetentionUserEmailOnUserEmailUpdated";
import { RetentionUserDoesNotExist } from "../../../../../../src/contexts/retention/users/domain/RetentionUserDoesNotExist";
import { UserEmailUpdatedDomainEventMother } from "../../../../rrss/users/domain/UserEmailUpdatedDomainEventMother";
import { UserIdMother } from "../../../../rrss/users/domain/UserIdMother";
import { RetentionUserMother } from "../../domain/RetentionUserMother";
import { MockRetentionUserRepository } from "../../infrastructure/MockRetentionUserRepository";

describe("UpdateRetentionUserEmailOnUserEmailUpdated should", () => {
	const repository = new MockRetentionUserRepository();
	const subscriber = new UpdateRetentionUserEmailOnUserEmailUpdated(
		new RetentionUserEmailUpdater(repository),
	);

	it("throw an exception if the user does not exist", async () => {
		const event = UserEmailUpdatedDomainEventMother.create();
		const userId = UserIdMother.create(event.id);

		repository.shouldSearchAndReturnNull(userId);

		await expect(subscriber.on(event)).rejects.toThrow(new RetentionUserDoesNotExist(event.id));
	});

	it("update the retention user email", async () => {
		const event = UserEmailUpdatedDomainEventMother.create();
		const existingUser = RetentionUserMother.create({ id: event.id });

		repository.shouldSearch(existingUser);
		repository.shouldSave(
			RetentionUserMother.create({ ...existingUser.toPrimitives(), email: event.email }),
		);

		await subscriber.on(event);
	});
});
