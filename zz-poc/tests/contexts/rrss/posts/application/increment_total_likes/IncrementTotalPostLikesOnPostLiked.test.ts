import { IncrementTotalPostLikesOnPostLiked } from "../../../../../../src/contexts/rrss/posts/application/increment_total_likes/IncrementTotalPostLikesOnPostLiked";
import { TotalPostLikesIncrementer } from "../../../../../../src/contexts/rrss/posts/application/increment_total_likes/TotalPostLikesIncrementer";
import { PostDoesNotExist } from "../../../../../../src/contexts/rrss/posts/domain/PostDoesNotExist";
import { MockEventBus } from "../../../../shared/infrastructure/MockEventBus";
import { PostLikedDomainEventMother } from "../../../post_likes/domain/PostLikedDomainEventMother";
import { PostIdMother } from "../../domain/PostIdMother";
import { PostLikesIncrementedDomainEventMother } from "../../domain/PostLikesIncrementedDomainEventMother";
import { PostMother } from "../../domain/PostMother";
import { MockPostRepository } from "../../infrastructure/MockPostRepository";

describe("IncrementTotalPostLikesOnPostLiked should", () => {
	const repository = new MockPostRepository();
	const eventBus = new MockEventBus();

	const subscriber = new IncrementTotalPostLikesOnPostLiked(
		new TotalPostLikesIncrementer(repository, eventBus),
	);

	it("throw an exception if the post does not exist", async () => {
		const event = PostLikedDomainEventMother.create();
		const id = PostIdMother.create(event.postId);

		repository.shouldSearchAndReturnNull(id);

		await expect(subscriber.on(event)).rejects.toThrow(new PostDoesNotExist(event.postId));
	});

	it("increment post likes", async () => {
		const event = PostLikedDomainEventMother.create();
		const existingPost = PostMother.create({ id: event.postId });

		const expectedLikes = existingPost.totalLikes.value + 1;

		const expectedDomainEvent = PostLikesIncrementedDomainEventMother.create({
			id: event.postId,
			likes: expectedLikes,
		});

		repository.shouldSearch(existingPost);
		repository.shouldSave(
			PostMother.create({ ...existingPost.toPrimitives(), totalLikes: expectedLikes }),
		);
		eventBus.shouldPublish([expectedDomainEvent]);

		await subscriber.on(event);
	});
});
