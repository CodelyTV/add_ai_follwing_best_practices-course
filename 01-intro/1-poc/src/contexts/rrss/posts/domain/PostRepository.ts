import { Post } from "./Post";
import { PostId } from "./PostId";

export interface PostRepository {
	save(user: Post): Promise<void>;

	search(id: PostId): Promise<Post | null>;
}
