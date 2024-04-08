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
	suggested_courses: string;
};

export class MySqlUserRepository implements UserRepository {
	constructor(
		private readonly connection: MariaDBConnection,
		private readonly courseSuggestionsRepository: CourseSuggestionsRepository,
	) {}

	async save(user: User): Promise<void> {
		const userPrimitives = user.toPrimitives();

		const query = `
			INSERT INTO mooc__users (id, name, email, profile_picture, status, finished_courses, suggested_courses)
			VALUES (
				'${userPrimitives.id}',
				'${userPrimitives.name}',
				'${userPrimitives.email}',
				'${userPrimitives.profilePicture}',
				'${userPrimitives.status}',
				'${JSON.stringify(userPrimitives.finishedCourses)}',
				'${userPrimitives.suggestedCourses}'
			)
			ON DUPLICATE KEY UPDATE
				 name = VALUES(name),
				 email = VALUES(email),
				 profile_picture = VALUES(profile_picture),
				 status = VALUES(status),
				 finished_courses = VALUES(finished_courses),
				 suggested_courses = VALUES(suggested_courses);
		`;

		await this.connection.execute(query);
	}

	async search(id: UserId): Promise<User | null> {
		const query = `
			SELECT id, name, email, profile_picture, status, finished_courses, suggested_courses
			FROM mooc__users
			WHERE id = '${id.value}';
		`;

		const result = await this.connection.searchOne<DatabaseUser>(query);

		if (!result) {
			return null;
		}

		const finishedCourses = JSON.parse(result.finished_courses) as string[];

		const suggestedCourses = this.hasToSearchSuggestions(result, finishedCourses)
			? await this.courseSuggestionsRepository.byFinishedCourses(finishedCourses)
			: result.suggested_courses;

		const user = User.fromPrimitives({
			id: result.id,
			name: result.name,
			email: result.email,
			profilePicture: result.profile_picture,
			status: result.status,
			finishedCourses,
			suggestedCourses,
		});

		if (this.hasToSearchSuggestions(result, finishedCourses)) {
			await this.save(user);
		}

		return user;
	}

	private hasToSearchSuggestions(result: DatabaseUser, finishedCourses: string[]) {
		return !this.userHasSuggestions(result) && this.userHasAnyCourseFinished(finishedCourses);
	}

	private userHasSuggestions(result: DatabaseUser): boolean {
		return result.suggested_courses !== "";
	}

	private userHasAnyCourseFinished(finishedCourses: string[]): boolean {
		return finishedCourses.length > 0;
	}
}
