import { PostLiker } from "../../../../../../src/contexts/rrss/post_likes/application/like/PostLiker";
import { MockClock } from "../../../../shared/infrastructure/MockClock";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { PostLikedDomainEventMother } from "../../domain/PostLikedDomainEventMother";
import { PostLikeMother } from "../../domain/PostLikeMother";
import { MockPostLikeRepository } from "../../infrastructure/MockPostLikeRepository";

describe("PostLiker should", () => {
	const clock = new MockClock();
	const repository = new MockPostLikeRepository();
	const eventBus = new MockEventBus();
	const postLiker = new PostLiker(clock, repository, eventBus);

	it("like a post", async () => {
		const expectedPostLike = PostLikeMother.create();
		const expectedPostLikePrimitives = expectedPostLike.toPrimitives();

		const expectedDomainEvent = PostLikedDomainEventMother.create(expectedPostLikePrimitives);

		clock.shouldGenerate(expectedPostLike.likedAt);
		repository.shouldSave(expectedPostLike);
		eventBus.shouldPublish([expectedDomainEvent]);

		await postLiker.like(
			expectedPostLikePrimitives.id,
			expectedPostLikePrimitives.postId,
			expectedPostLikePrimitives.userId,
		);
	});
});
