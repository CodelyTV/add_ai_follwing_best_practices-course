import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { UserId } from "../../users/domain/UserId";
import { UserCourseSuggestions } from "../domain/UserCourseSuggestions";
import { UserCourseSuggestionsRepository } from "../domain/UserCourseSuggestionsRepository";

type DatabaseUserCourseSuggestions = {
	user_id: string;
	completed_courses: string;
	suggested_courses: string;
};

export class MySqlUserCourseSuggestionsRepository implements UserCourseSuggestionsRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async save(user: UserCourseSuggestions): Promise<void> {
		const primitives = user.toPrimitives();

		const query = `
			INSERT INTO mooc__user_course_suggestions (user_id, completed_courses, suggested_courses)
			VALUES (
				'${primitives.userId}',
				'${JSON.stringify(primitives.completedCourses)}',
				'${primitives.suggestions}'
			)
			ON DUPLICATE KEY UPDATE
				user_id = VALUES(user_id),
				completed_courses = VALUES(completed_courses),
				suggested_courses = VALUES(suggested_courses);
		`;

		await this.connection.execute(query);
	}

	async search(id: UserId): Promise<UserCourseSuggestions | null> {
		const query = `
			SELECT user_id, completed_courses, suggested_courses
			FROM mooc__user_course_suggestions
			WHERE user_id = '${id.value}';
		`;

		const result = await this.connection.searchOne<DatabaseUserCourseSuggestions>(query);

		if (!result) {
			return null;
		}

		const completedCourses = JSON.parse(result.completed_courses) as string[];

		return UserCourseSuggestions.fromPrimitives({
			userId: result.user_id,
			completedCourses,
			suggestions: result.suggested_courses,
		});
	}
}
