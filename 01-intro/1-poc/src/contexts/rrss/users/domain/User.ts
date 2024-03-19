import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UserArchivedDomainEvent } from "./UserArchivedDomainEvent";
import { UserEmail } from "./UserEmail";
import { UserEmailUpdatedDomainEvent } from "./UserEmailUpdatedDomainEvent";
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
};

export class User extends AggregateRoot {
	private constructor(
		public readonly id: UserId,
		public readonly name: UserName,
		public email: UserEmail,
		public readonly profilePicture: UserProfilePicture,
		public status: UserStatus,
	) {
		super();
	}

	static create(id: string, name: string, email: string, profilePicture: string): User {
		const defaultUserStatus = UserStatus.Active;

		const user = new User(
			new UserId(id),
			new UserName(name),
			new UserEmail(email),
			new UserProfilePicture(profilePicture),
			defaultUserStatus,
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
		);
	}

	toPrimitives(): UserPrimitives {
		return {
			id: this.id.value,
			name: this.name.value,
			email: this.email.value,
			profilePicture: this.profilePicture.value,
			status: this.status,
		};
	}

	updateEmail(email: string): void {
		this.email = new UserEmail(email);

		this.record(new UserEmailUpdatedDomainEvent(this.id.value, email));
	}

	archive(): void {
		this.status = UserStatus.Archived;

		this.record(new UserArchivedDomainEvent(this.id.value));
	}
}
