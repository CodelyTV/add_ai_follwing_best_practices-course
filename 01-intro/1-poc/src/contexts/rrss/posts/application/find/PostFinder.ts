import { Post } from "../../domain/Post";
import { PostDoesNotExist } from "../../domain/PostDoesNotExist";
import { PostId } from "../../domain/PostId";
import { PostRepository } from "../../domain/PostRepository";

export class PostFinder {
	constructor(private readonly repository: PostRepository) {}

	async find(id: string): Promise<Post> {
		const post = await this.repository.search(new PostId(id));

		if (!post) {
			throw new PostDoesNotExist(id);
		}

		return post;
	}
}
