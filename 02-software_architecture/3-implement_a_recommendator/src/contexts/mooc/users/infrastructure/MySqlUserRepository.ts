import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { UserCourseSuggestionsRepository } from "../../user_course_suggestions/domain/UserCourseSuggestionsRepository";
import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

type DatabaseUser = {
	id: string;
	name: string;
	email: string;
	profile_picture: string;
	status: string;
	completed_courses: string;
};

export class MySqlUserRepository implements UserRepository {
	constructor(
		private readonly connection: MariaDBConnection,
		private readonly suggestionsRepository: UserCourseSuggestionsRepository,
	) {}

	async save(user: User): Promise<void> {
		const userPrimitives = user.toPrimitives();

		const query = `
			INSERT INTO mooc__users (id, name, email, profile_picture, status, completed_courses)
			VALUES (
				'${userPrimitives.id}',
				'${userPrimitives.name}',
				'${userPrimitives.email}',
				'${userPrimitives.profilePicture}',
				'${userPrimitives.status.valueOf()}',
				'${JSON.stringify(userPrimitives.completedCourses)}'
			);
		`;

		await this.connection.execute(query);
	}

	async search(id: UserId): Promise<User | null> {
		const query = `
			SELECT id, name, email, profile_picture, completed_courses
			FROM mooc__users
			WHERE id = '${id.value}';
		`;

		const result = await this.connection.searchOne<DatabaseUser>(query);

		if (!result) {
			return null;
		}

		const completedCourses = JSON.parse(result.completed_courses) as string[];
		const suggestedCourses = this.userHasAnyCourseCompleted(completedCourses)
			? await this.suggestionsRepository.byCompletedCourses(completedCourses)
			: "";

		return User.fromPrimitives({
			id: result.id,
			name: result.name,
			email: result.email,
			profilePicture: result.profile_picture,
			status: result.status,
			completedCourses,
			suggestedCourses,
		});
	}

	private userHasAnyCourseCompleted(completedCourses: string[]): boolean {
		return completedCourses.length > 0;
	}
}
