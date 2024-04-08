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
	suggested_courses: string;
};

export class MySqlUserRepository implements UserRepository {
	constructor(
		private readonly connection: MariaDBConnection,
		private readonly suggestionsRepository: UserCourseSuggestionsRepository,
	) {}

	async save(user: User): Promise<void> {
		const userPrimitives = user.toPrimitives();

		const query = `
			INSERT INTO mooc__users (id, name, email, profile_picture, status, completed_courses, suggested_courses)
			VALUES (
				'${userPrimitives.id}',
				'${userPrimitives.name}',
				'${userPrimitives.email}',
				'${userPrimitives.profilePicture}',
				'${userPrimitives.status}',
				'${JSON.stringify(userPrimitives.completedCourses)}',
				'${userPrimitives.suggestedCourses}'
			)
			ON DUPLICATE KEY UPDATE
				 name = VALUES(name),
				 email = VALUES(email),
				 profile_picture = VALUES(profile_picture),
				 status = VALUES(status),
				 completed_courses = VALUES(completed_courses),
				 suggested_courses = VALUES(suggested_courses);
		`;

		await this.connection.execute(query);
	}

	async search(id: UserId): Promise<User | null> {
		const query = `
			SELECT id, name, email, profile_picture, status, completed_courses, suggested_courses
			FROM mooc__users
			WHERE id = '${id.value}';
		`;

		const result = await this.connection.searchOne<DatabaseUser>(query);

		if (!result) {
			return null;
		}

		const completedCourses = JSON.parse(result.completed_courses) as string[];

		const suggestedCourses = this.hasToSearchSuggestions(result, completedCourses)
			? await this.suggestionsRepository.byCompletedCourses(completedCourses)
			: result.suggested_courses;

		const user = User.fromPrimitives({
			id: result.id,
			name: result.name,
			email: result.email,
			profilePicture: result.profile_picture,
			status: result.status,
			completedCourses,
			suggestedCourses,
		});

		if (this.hasToSearchSuggestions(result, completedCourses)) {
			await this.save(user);
		}

		return user;
	}

	private hasToSearchSuggestions(result: DatabaseUser, completedCourses: string[]) {
		return !this.userHasSuggestions(result) && this.userHasAnyCourseCompleted(completedCourses);
	}

	private userHasSuggestions(result: DatabaseUser): boolean {
		return result.suggested_courses !== "";
	}

	private userHasAnyCourseCompleted(completedCourses: string[]): boolean {
		return completedCourses.length > 0;
	}
}
