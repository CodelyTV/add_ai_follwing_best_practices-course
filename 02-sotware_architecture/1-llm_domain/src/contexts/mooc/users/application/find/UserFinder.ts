import { CoursesRecommendationLlm } from "../../domain/CoursesRecommendationLlm";
import { User } from "../../domain/User";
import { UserDoesNotExist } from "../../domain/UserDoesNotExist";
import { UserId } from "../../domain/UserId";
import { UserRepository } from "../../domain/UserRepository";

export class UserFinder {
	constructor(
		private readonly repository: UserRepository,
		private readonly coursesRecommendationLlm: CoursesRecommendationLlm,
	) {}

	async find(id: string): Promise<User> {
		const user = await this.repository.search(new UserId(id));

		if (user === null) {
			throw new UserDoesNotExist(id);
		}

		if (user.finishedCourses.length > 0) {
			const recommendations = await this.coursesRecommendationLlm.predict(user.finishedCourses);

			user.updateRecommendedCourses(recommendations);
		}

		return user;
	}
}
