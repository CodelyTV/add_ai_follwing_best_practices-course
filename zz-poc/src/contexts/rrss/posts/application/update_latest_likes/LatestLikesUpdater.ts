import { UserFinder } from "../../../users/application/find/UserFinder";
import { PostLatestLike } from "../../domain/PostLatestLike";
import { PostRepository } from "../../domain/PostRepository";
import { PostFinder } from "../find/PostFinder";

export class LatestLikesUpdater {
	constructor(
		private readonly userFinder: UserFinder,
		private readonly postFinder: PostFinder,
		private readonly repository: PostRepository,
	) {}

	async update(likeId: string, postId: string, userId: string, likedAt: Date): Promise<void> {
		const post = await this.postFinder.find(postId);
		const user = await this.userFinder.find(userId);

		post.addLatestLike(
			PostLatestLike.create(likeId, userId, user.name.value, user.profilePicture.value, likedAt),
		);

		await this.repository.save(post);
	}
}
