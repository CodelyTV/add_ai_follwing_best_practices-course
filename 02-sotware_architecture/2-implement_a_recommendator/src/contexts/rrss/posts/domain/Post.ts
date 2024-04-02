import { Primitives } from "@codelytv/primitives-type";

import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { Clock } from "../../../shared/domain/Clock";
import { UserId } from "../../users/domain/UserId";
import { PostContent } from "./PostContent";
import { PostId } from "./PostId";
import { PostLatestLike } from "./PostLatestLike";
import { PostLatestLikes } from "./PostLatestLikes";
import { PostLikesIncrementedDomainEvent } from "./PostLikesIncrementedDomainEvent";
import { PostPublishedDomainEvent } from "./PostPublishedDomainEvent";
import { PostTotalLikes } from "./PostTotalLikes";

export class Post extends AggregateRoot {
	private constructor(
		public readonly id: PostId,
		public readonly userId: UserId,
		public readonly content: PostContent,
		public totalLikes: PostTotalLikes,
		public latestLikes: PostLatestLikes,
		public readonly createdAt: Date,
	) {
		super();
	}

	static publish(id: string, userId: string, content: string, clock: Clock): Post {
		const post = new Post(
			new PostId(id),
			new UserId(userId),
			new PostContent(content),
			PostTotalLikes.init(),
			PostLatestLikes.init(),
			clock.now(),
		);

		post.record(new PostPublishedDomainEvent(id, userId, content));

		return post;
	}

	static fromPrimitives(primitives: Primitives<Post>): Post {
		return new Post(
			new PostId(primitives.id),
			new UserId(primitives.userId),
			new PostContent(primitives.content),
			new PostTotalLikes(primitives.totalLikes),
			PostLatestLikes.fromPrimitives(primitives.latestLikes),
			primitives.createdAt as Date,
		);
	}

	toPrimitives(): Primitives<Post> {
		return {
			id: this.id.value,
			userId: this.userId.value,
			content: this.content.value,
			totalLikes: this.totalLikes.value,
			latestLikes: this.latestLikes.toPrimitives(),
			createdAt: this.createdAt,
		};
	}

	incrementTotalLikes(): void {
		this.totalLikes = this.totalLikes.increment();

		this.record(new PostLikesIncrementedDomainEvent(this.id.value, this.totalLikes.value));
	}

	addLatestLike(postLatestLike: PostLatestLike): void {
		this.latestLikes = this.latestLikes.add(postLatestLike);
	}
}
