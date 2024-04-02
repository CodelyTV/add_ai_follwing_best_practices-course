import { CoursesSuggestionLlm } from "../../domain/CoursesSuggestionLlm";
import { UserId } from "../../domain/UserId";
import { UserRepository } from "../../domain/UserRepository";

export class RecommendedCoursesUpdater {
	constructor(
		private readonly repository: UserRepository,
		private readonly coursesSuggestionLlm: CoursesSuggestionLlm,
	) {}

	async update(userId: string, courseName: string): Promise<void> {
		const user = await this.repository.search(new UserId(userId));

		if (user === null) {
			throw new Error("User not found");
		}

		user.finishCourse(courseName);

		const recommendedCourses = await this.coursesSuggestionLlm.predict(user.finishedCourses);

		user.updateRecommendedCourses(recommendedCourses);

		await this.repository.save(user);
	}
}
