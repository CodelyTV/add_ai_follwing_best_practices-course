import { NumberValueObject } from "../../../shared/domain/NumberValueObject";

export class PostTotalLikes extends NumberValueObject {
	static init(): PostTotalLikes {
		return new PostTotalLikes(0);
	}

	increment(): PostTotalLikes {
		return new PostTotalLikes(this.value + 1);
	}
}
