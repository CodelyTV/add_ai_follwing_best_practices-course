import { RecommendedCoursesUpdater } from "../../../../../../src/contexts/mooc/users/application/update_recommended_courses/RecommendedCoursesUpdater";
import { UpdateRecommendedCoursesOnCourseProgressFinished } from "../../../../../../src/contexts/mooc/users/application/update_recommended_courses/UpdateRecommendedCoursesOnCourseProgressFinished";
import { User } from "../../../../../../src/contexts/mooc/users/domain/User";
import { CourseProgressFinishedDomainEventMother } from "../../../courses_progress/domain/CourseProgressFinishedDomainEventMother";
import { UserMother } from "../../domain/UserMother";
import { MockCoursesSuggestionLlm } from "../../infrastructure/MockCoursesSuggestionLlm";
import { MockUserRepository } from "../../infrastructure/MockUserRepository";

describe("UpdateRecommendedCoursesOnCourseProgressFinished should", () => {
	const repository = new MockUserRepository();
	const coursesSuggestionLlm = new MockCoursesSuggestionLlm();
	const subscriber = new UpdateRecommendedCoursesOnCourseProgressFinished(
		new RecommendedCoursesUpdater(repository, coursesSuggestionLlm),
	);

	it("update the recommended courses", async () => {
		const event = CourseProgressFinishedDomainEventMother.create();

		const existingUser = UserMother.create({ id: event.userId });
		const finishedCourses = [...existingUser.finishedCourses, event.courseName];
		const recommendedCourses = "Course 1, Course 2";
		const userWithRecommendedCourses = User.fromPrimitives({
			...existingUser.toPrimitives(),
			finishedCourses,
			recommendedCourses,
		});

		repository.shouldSearch(existingUser);
		coursesSuggestionLlm.shouldPredict(finishedCourses, recommendedCourses);
		repository.shouldSave(userWithRecommendedCourses);

		await subscriber.on(event);
	});
});
