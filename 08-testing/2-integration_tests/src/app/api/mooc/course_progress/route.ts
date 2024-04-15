import { NextResponse } from "next/server";

import { UserCourseProgressCompleter } from "../../../../contexts/mooc/user_course_progress/application/complete/UserCourseProgressCompleter";
import { GenerateUserCourseSuggestionsOnUserCourseProgressCompleted } from "../../../../contexts/mooc/user_course_suggestions/application/generate/GenerateUserCourseSuggestionsOnUserCourseProgressCompleted";
import { UserCourseSuggestionsGenerator } from "../../../../contexts/mooc/user_course_suggestions/application/generate/UserCourseSuggestionsGenerator";
import { CourseSuggestionPrimitives } from "../../../../contexts/mooc/user_course_suggestions/domain/CourseSuggestion";
import { MySqlUserCourseSuggestionsRepository } from "../../../../contexts/mooc/user_course_suggestions/infrastructure/MySqlUserCourseSuggestionsRepository";
import { OllamaMistralCourseSuggestionsGenerator } from "../../../../contexts/mooc/user_course_suggestions/infrastructure/OllamaMistralCourseSuggestionsGenerator";
import { UpdateUserCourseSuggestionsOnUserCourseSuggestionsGenerated } from "../../../../contexts/mooc/users/application/update_course_suggestions/UpdateUserCourseSuggestionsOnUserCourseSuggestionsGenerated";
import { UserCourseSuggestionsUpdater } from "../../../../contexts/mooc/users/application/update_course_suggestions/UserCourseSuggestionsUpdater";
import { UserFinder } from "../../../../contexts/mooc/users/domain/UserFinder";
import { MySqlUserRepository } from "../../../../contexts/mooc/users/infrastructure/MySqlUserRepository";
import { InMemoryEventBus } from "../../../../contexts/shared/infrastructure/domain_event/InMemoryEventBus";
import { MariaDBConnection } from "../../../../contexts/shared/infrastructure/MariaDBConnection";

const mariaDBConnection = new MariaDBConnection();

const mySqlUserRepository = new MySqlUserRepository(mariaDBConnection);
const userFinder = new UserFinder(mySqlUserRepository);

const completer = new UserCourseProgressCompleter(
	new InMemoryEventBus([
		new GenerateUserCourseSuggestionsOnUserCourseProgressCompleted(
			new UserCourseSuggestionsGenerator(
				new MySqlUserCourseSuggestionsRepository(mariaDBConnection),
				new OllamaMistralCourseSuggestionsGenerator(),
				new InMemoryEventBus([
					new UpdateUserCourseSuggestionsOnUserCourseSuggestionsGenerated(
						new UserCourseSuggestionsUpdater(userFinder, mySqlUserRepository),
					),
				]),
			),
		),
	]),
);

export async function POST(request: Request): Promise<NextResponse> {
	const { courseId, userId, courseName } = (await request.json()) as {
		courseId: string;
		userId: string;
		courseName: string;
	};

	await completer.complete(courseId, userId, courseName);

	const user = await userFinder.find(userId);

	const primitives = user.toPrimitives();

	return NextResponse.json({
		name: primitives.name,
		suggestedCourses: JSON.parse(primitives.suggestedCourses) as CourseSuggestionPrimitives[],
	});
}
