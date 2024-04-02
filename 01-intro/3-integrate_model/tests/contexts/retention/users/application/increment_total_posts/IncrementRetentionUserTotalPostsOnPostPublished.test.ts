import { IncrementRetentionUserTotalPostsOnPostPublished } from "../../../../../../src/contexts/retention/users/application/increment_total_posts/IncrementRetentionUserTotalPostsOnPostPublished";
import { RetentionUserTotalPostsIncrementer } from "../../../../../../src/contexts/retention/users/application/increment_total_posts/RetentionUserTotalPostsIncrementer";
import { RetentionUserDoesNotExist } from "../../../../../../src/contexts/retention/users/domain/RetentionUserDoesNotExist";
import { PostPublishedDomainEventMother } from "../../../../rrss/posts/domain/PostPublishedDomainEventMother";
import { UserIdMother } from "../../../../rrss/users/domain/UserIdMother";
import { RetentionUserMother } from "../../domain/RetentionUserMother";
import { MockRetentionUserRepository } from "../../infrastructure/MockRetentionUserRepository";

describe("IncrementRetentionUserTotalPostsOnPostPublished should", () => {
	const repository = new MockRetentionUserRepository();
	const subscriber = new IncrementRetentionUserTotalPostsOnPostPublished(
		new RetentionUserTotalPostsIncrementer(repository),
	);

	it("throw an exception if the user does not exist", async () => {
		const event = PostPublishedDomainEventMother.create();
		const userId = UserIdMother.create(event.userId);

		repository.shouldSearchAndReturnNull(userId);

		await expect(subscriber.on(event)).rejects.toThrow(new RetentionUserDoesNotExist(event.userId));
	});

	it("increment total posts", async () => {
		const event = PostPublishedDomainEventMother.create();
		const existingUser = RetentionUserMother.create({ id: event.userId });

		repository.shouldSearch(existingUser);
		repository.shouldSave(
			RetentionUserMother.create({
				...existingUser.toPrimitives(),
				totalPosts: existingUser.totalPosts + 1,
			}),
		);

		await subscriber.on(event);
	});
});
