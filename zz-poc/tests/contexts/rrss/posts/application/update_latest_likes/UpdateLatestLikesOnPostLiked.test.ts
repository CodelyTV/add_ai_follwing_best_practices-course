import { PostFinder } from "../../../../../../src/contexts/rrss/posts/application/find/PostFinder";
import { LatestLikesUpdater } from "../../../../../../src/contexts/rrss/posts/application/update_latest_likes/LatestLikesUpdater";
import { UpdateLatestLikesOnPostLiked } from "../../../../../../src/contexts/rrss/posts/application/update_latest_likes/UpdateLatestLikesOnPostLiked";
import { PostDoesNotExist } from "../../../../../../src/contexts/rrss/posts/domain/PostDoesNotExist";
import { UserFinder } from "../../../../../../src/contexts/rrss/users/application/find/UserFinder";
import { UserDoesNotExist } from "../../../../../../src/contexts/rrss/users/domain/UserDoesNotExist";
import { PostLikedDomainEventMother } from "../../../post_likes/domain/PostLikedDomainEventMother";
import { UserIdMother } from "../../../users/domain/UserIdMother";
import { UserMother } from "../../../users/domain/UserMother";
import { MockUserRepository } from "../../../users/infrastructure/MockUserRepository";
import { PostIdMother } from "../../domain/PostIdMother";
import { PostLatestLikesMother } from "../../domain/PostLatestLikesMother";
import { PostMother } from "../../domain/PostMother";
import { MockPostRepository } from "../../infrastructure/MockPostRepository";

describe("UpdateLatestLikesOnPostLiked should", () => {
	const userRepository = new MockUserRepository();
	const repository = new MockPostRepository();

	const subscriber = new UpdateLatestLikesOnPostLiked(
		new LatestLikesUpdater(new UserFinder(userRepository), new PostFinder(repository), repository),
	);

	it("throw an exception if the post does not exist", async () => {
		const event = PostLikedDomainEventMother.create();
		const id = PostIdMother.create(event.postId);

		repository.shouldSearchAndReturnNull(id);

		await expect(subscriber.on(event)).rejects.toThrow(new PostDoesNotExist(event.postId));
	});

	it("throw an exception if user does not exist", async () => {
		const event = PostLikedDomainEventMother.create();

		const existingPost = PostMother.create({ id: event.postId });

		repository.shouldSearch(existingPost);
		userRepository.shouldSearchAndReturnNull(UserIdMother.create(event.userId));

		await expect(subscriber.on(event)).rejects.toThrow(new UserDoesNotExist(event.userId));
	});

	it("add the first latest post like", async () => {
		const event = PostLikedDomainEventMother.create();

		const existingPost = PostMother.create({
			id: event.postId,
			latestLikes: PostLatestLikesMother.empty().toPrimitives(),
		});

		const existingUser = UserMother.create({ id: event.userId });

		repository.shouldSearch(existingPost);
		userRepository.shouldSearch(existingUser);

		const expectedPostLikes = PostLatestLikesMother.one({
			id: event.id,
			userId: event.userId,
			userName: existingUser.name.value,
			profilePictureUrl: existingUser.profilePicture.value,
			likedAt: event.occurredOn,
		});

		repository.shouldSave(
			PostMother.create({
				...existingPost.toPrimitives(),
				latestLikes: expectedPostLikes.toPrimitives(),
			}),
		);

		await subscriber.on(event);
	});
});
