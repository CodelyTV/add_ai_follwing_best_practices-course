import { PostId } from "../../../../rrss/posts/domain/PostId";
import { RetentionPost } from "../../domain/RetentionPost";
import { RetentionPostRepository } from "../../domain/RetentionPostRepository";

export class RetentionPostCreator {
	constructor(private readonly repository: RetentionPostRepository) {}
	async create(id: string, userId: string): Promise<void> {
		if (await this.repository.search(new PostId(id))) {
			return;
		}

		const user = RetentionPost.create(id, userId);

		await this.repository.save(user);
	}
}
