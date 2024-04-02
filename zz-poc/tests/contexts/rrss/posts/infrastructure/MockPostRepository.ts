import { Post } from "../../../../../src/contexts/rrss/posts/domain/Post";
import { PostId } from "../../../../../src/contexts/rrss/posts/domain/PostId";
import { PostRepository } from "../../../../../src/contexts/rrss/posts/domain/PostRepository";

export class MockPostRepository implements PostRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearch = jest.fn();

	async save(post: Post): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(post.toPrimitives());

		return Promise.resolve();
	}

	async search(id: PostId): Promise<Post | null> {
		expect(this.mockSearch).toHaveBeenCalledWith(id);

		return this.mockSearch() as Promise<Post | null>;
	}

	shouldSearchAndReturnNull(id: PostId): void {
		this.mockSearch(id);
		this.mockSearch.mockReturnValueOnce(null);
	}

	shouldSave(post: Post): void {
		this.mockSave(post.toPrimitives());
	}

	shouldSearch(post: Post): void {
		this.mockSearch(post.id);
		this.mockSearch.mockReturnValueOnce(post);
	}
}
