import { PostId } from "../../../../rrss/posts/domain/PostId";
import { RetentionPost } from "../../domain/RetentionPost";
import { RetentionPostDoesNotExist } from "../../domain/RetentionPostDoesNotExist";
import { RetentionPostRepository } from "../../domain/RetentionPostRepository";

export class RetentionPostFinder {
	constructor(private readonly repository: RetentionPostRepository) {}

	async find(id: string): Promise<RetentionPost> {
		const post = await this.repository.search(new PostId(id));

		if (!post) {
			throw new RetentionPostDoesNotExist(id);
		}

		return post;
	}
}
