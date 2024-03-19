import { RetentionPost } from "../../../../../src/contexts/retention/posts/domain/RetentionPost";
import { RetentionPostRepository } from "../../../../../src/contexts/retention/posts/domain/RetentionPostRepository";
import { PostId } from "../../../../../src/contexts/rrss/posts/domain/PostId";

export class MockRetentionPostRepository implements RetentionPostRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearch = jest.fn();

	async save(post: RetentionPost): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(post.toPrimitives());

		return Promise.resolve();
	}

	async search(id: PostId): Promise<RetentionPost | null> {
		expect(this.mockSearch).toHaveBeenCalledWith(id);

		return this.mockSearch() as Promise<RetentionPost | null>;
	}

	shouldSave(post: RetentionPost): void {
		this.mockSave(post.toPrimitives());
	}

	shouldSearch(post: RetentionPost): void {
		this.mockSearch(post.id);
		this.mockSearch.mockReturnValueOnce(post);
	}

	shouldSearchAndReturnNull(id: PostId): void {
		this.mockSearch(id);
		this.mockSearch.mockReturnValueOnce(null);
	}
}
