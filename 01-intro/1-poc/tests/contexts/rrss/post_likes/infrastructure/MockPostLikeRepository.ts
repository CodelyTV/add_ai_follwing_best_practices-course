import { PostLike } from "../../../../../src/contexts/rrss/post_likes/domain/PostLike";
import { PostLikeId } from "../../../../../src/contexts/rrss/post_likes/domain/PostLikeId";
import { PostLikeRepository } from "../../../../../src/contexts/rrss/post_likes/domain/PostLikeRepository";

export class MockPostLikeRepository implements PostLikeRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearch = jest.fn();

	async save(post: PostLike): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(post.toPrimitives());

		return Promise.resolve();
	}

	async search(id: PostLikeId): Promise<PostLike | null> {
		expect(this.mockSearch).toHaveBeenCalledWith(id);

		return this.mockSearch() as Promise<PostLike | null>;
	}

	shouldSave(post: PostLike): void {
		this.mockSave(post.toPrimitives());
	}

	shouldSearch(post: PostLike): void {
		this.mockSearch(post.id);
		this.mockSearch.mockReturnValueOnce(post);
	}
}
