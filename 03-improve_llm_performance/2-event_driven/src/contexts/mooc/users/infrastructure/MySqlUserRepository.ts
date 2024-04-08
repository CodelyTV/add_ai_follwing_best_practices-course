import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { CoursesSuggestionLlm } from "../domain/CoursesSuggestionLlm";
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
	suggested_courses: null | string;
};

export class MySqlUserRepository implements UserRepository {
	constructor(
		private readonly connection: MariaDBConnection,
		private readonly coursesSuggestionLlm: CoursesSuggestionLlm,
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
			SELECT id, name, email, profile_picture, finished_courses, suggested_courses
			FROM mooc__users
			WHERE id = '${id.value}';
		`;

		const result = await this.connection.searchOne<DatabaseUser>(query);

		if (!result) {
			return null;
		}

		const finishedCourses = JSON.parse(result.finished_courses) as string[];

		const suggestedCourses =
			result.suggested_courses === null && finishedCourses.length > 0
				? await this.predictAndSavesuggestedCourses(id, finishedCourses)
				: result.suggested_courses;

		return User.fromPrimitives({
			id: result.id,
			name: result.name,
			email: result.email,
			profilePicture: result.profile_picture,
			status: result.status,
			finishedCourses,
			suggestedCourses: suggestedCourses ?? "",
		});
	}

	private async predictAndSavesuggestedCourses(
		id: UserId,
		finishedCourses: string[],
	): Promise<string> {
		const suggestedCourses = await this.coursesSuggestionLlm.predict(finishedCourses);

		const query = `UPDATE mooc__users 
                       SET suggested_courses = '${JSON.stringify(suggestedCourses)}'
                       WHERE id = '${id.value}'`;

		await this.connection.execute(query);

		return suggestedCourses;
	}
}
