import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UserEmail } from "./UserEmail";
import { UserId } from "./UserId";
import { UserName } from "./UserName";
import { UserProfilePicture } from "./UserProfilePicture";
import { UserRegisteredDomainEvent } from "./UserRegisteredDomainEvent";
import { UserStatus } from "./UserStatus";

export type UserPrimitives = {
	id: string;
	name: string;
	email: string;
	profilePicture: string;
	status: string;
	finishedCourses: string[];
	recommendedCourses: string;
};

export class User extends AggregateRoot {
	private constructor(
		public readonly id: UserId,
		public readonly name: UserName,
		public email: UserEmail,
		public readonly profilePicture: UserProfilePicture,
		public status: UserStatus,
		public finishedCourses: string[],
		public recommendedCourses: string,
	) {
		super();
	}

	static create(id: string, name: string, email: string, profilePicture: string): User {
		const defaultUserStatus = UserStatus.Active;
		const defaultFinishedCourses: string[] = [];
		const defaultRecommendedCourses: string = "";

		const user = new User(
			new UserId(id),
			new UserName(name),
			new UserEmail(email),
			new UserProfilePicture(profilePicture),
			defaultUserStatus,
			defaultFinishedCourses,
			defaultRecommendedCourses,
		);

		user.record(new UserRegisteredDomainEvent(id, name, email, profilePicture, defaultUserStatus));

		return user;
	}

	static fromPrimitives(primitives: UserPrimitives): User {
		return new User(
			new UserId(primitives.id),
			new UserName(primitives.name),
			new UserEmail(primitives.email),
			new UserProfilePicture(primitives.profilePicture),
			primitives.status as UserStatus,
			primitives.finishedCourses,
			primitives.recommendedCourses,
		);
	}

	toPrimitives(): UserPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
			email: this.email.value,
			profilePicture: this.profilePicture.value,
			status: this.status,
			finishedCourses: this.finishedCourses,
			recommendedCourses: this.recommendedCourses,
		};
	}
}
