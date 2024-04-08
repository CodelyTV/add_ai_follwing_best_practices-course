import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { CourseSuggestionsRepository } from "../../course_suggestions/domain/CourseSuggestionsRepository";
import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

type DatabaseUser = {
	id: string;
	name: string;
	email: string;
	profile_picture: string;
	status: string;
	finished_courses: string;
};

export class MySqlUserRepository implements UserRepository {
	constructor(
		private readonly connection: MariaDBConnection,
		private readonly courseSuggestionsRepository: CourseSuggestionsRepository,
	) {}

	async save(user: User): Promise<void> {
		const userPrimitives = user.toPrimitives();

		const query = `
			INSERT INTO mooc__users (id, name, email, profile_picture, status, finished_courses)
			VALUES (
						   '${userPrimitives.id}',
						   '${userPrimitives.name}',
						   '${userPrimitives.email}',
						   '${userPrimitives.profilePicture}',
						   '${userPrimitives.status.valueOf()}',
						   '${JSON.stringify(userPrimitives.finishedCourses)}'
				   );`;

		await this.connection.execute(query);
	}

	async search(id: UserId): Promise<User | null> {
		const query = `
			SELECT id, name, email, profile_picture, finished_courses
			FROM mooc__users
			WHERE id = '${id.value}';
		`;

		const result = await this.connection.searchOne<DatabaseUser>(query);

		if (!result) {
			return null;
		}

		const finishedCourses = JSON.parse(result.finished_courses) as string[];
		const suggestedCourses = this.userHasAnyCourseFinished(finishedCourses)
			? await this.courseSuggestionsRepository.byFinishedCourses(finishedCourses)
			: "";

		return User.fromPrimitives({
			id: result.id,
			name: result.name,
			email: result.email,
			profilePicture: result.profile_picture,
			status: result.status,
			finishedCourses,
			suggestedCourses,
		});
	}

	private userHasAnyCourseFinished(finishedCourses: string[]): boolean {
		return finishedCourses.length > 0;
	}
}
