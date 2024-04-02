import { PostLike } from "./PostLike";
import { PostLikeId } from "./PostLikeId";

export interface PostLikeRepository {
	save(user: PostLike): Promise<void>;

	search(id: PostLikeId): Promise<PostLike | null>;
}
