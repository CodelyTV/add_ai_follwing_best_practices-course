import { PostPublisher } from "../../../../../../src/contexts/rrss/posts/application/publish/PostPublisher";
import { MockClock } from "../../../../shared/infrastructure/MockClock";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { PostMother } from "../../domain/PostMother";
import { PostPublishedDomainEventMother } from "../../domain/PostPublishedDomainEventMother";
import { MockPostRepository } from "../../infrastructure/MockPostRepository";

describe("PostPublisher should", () => {
	const clock = new MockClock();
	const repository = new MockPostRepository();
	const eventBus = new MockEventBus();
	const postPublisher = new PostPublisher(clock, repository, eventBus);

	it("publish a valid post", async () => {
		const expectedPost = PostMother.create({ totalLikes: 0 });
		const expectedPostPrimitives = expectedPost.toPrimitives();

		const expectedDomainEvent = PostPublishedDomainEventMother.create(expectedPostPrimitives);

		clock.shouldGenerate(expectedPost.createdAt);
		repository.shouldSave(expectedPost);
		eventBus.shouldPublish([expectedDomainEvent]);

		await postPublisher.publish(
			expectedPostPrimitives.id,
			expectedPostPrimitives.userId,
			expectedPostPrimitives.content,
		);
	});
});
