import { UserId } from "../../../rrss/users/domain/UserId";

export type RetentionUserPrimitives = {
	id: string;
	email: string;
	name: string;
	totalPosts: number;
	averagePostLikes: number;
};

export class RetentionUser {
	constructor(
		public readonly id: UserId,
		public email: string,
		public readonly name: string,
		public totalPosts: number,
		public averagePostLikes: number,
	) {}

	static create(id: string, email: string, name: string): RetentionUser {
		return new RetentionUser(new UserId(id), email, name, 0, 0);
	}

	static fromPrimitives(primitives: RetentionUserPrimitives): RetentionUser {
		return new RetentionUser(
			new UserId(primitives.id),
			primitives.email,
			primitives.name,
			primitives.totalPosts,
			primitives.averagePostLikes,
		);
	}

	toPrimitives(): RetentionUserPrimitives {
		return {
			id: this.id.value,
			email: this.email,
			name: this.name,
			totalPosts: this.totalPosts,
			averagePostLikes: this.averagePostLikes,
		};
	}

	updateEmail(email: string): void {
		this.email = email;
	}

	incrementTotalPosts(): void {
		this.totalPosts = this.totalPosts + 1;
	}

	recalculateAveragePostLikes(): void {
		const totalLikes = this.averagePostLikes * this.totalPosts;

		const newTotalLikes = totalLikes + 1;

		this.averagePostLikes = newTotalLikes / this.totalPosts;
	}
}
