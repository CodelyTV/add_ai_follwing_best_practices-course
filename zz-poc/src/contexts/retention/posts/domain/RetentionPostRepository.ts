import { PostId } from "../../../rrss/posts/domain/PostId";
import { RetentionPost } from "./RetentionPost";

export abstract class RetentionPostRepository {
	abstract save(user: RetentionPost): Promise<void>;

	abstract search(id: PostId): Promise<RetentionPost | null>;
}
