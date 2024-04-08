import { NextResponse } from "next/server";

import { UserCourseProgressCompleter } from "../../../../contexts/mooc/user_course_progress/application/complete/UserCourseProgressCompleter";
import { GenerateUserCourseSuggestionsOnCourseProgressCompleted } from "../../../../contexts/mooc/user_course_suggestions/application/generate/GenerateUserCourseSuggestionsOnCourseProgressCompleted";
import { UserCourseSuggestionsGenerator } from "../../../../contexts/mooc/user_course_suggestions/application/generate/UserCourseSuggestionsGenerator";
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
		new GenerateUserCourseSuggestionsOnCourseProgressCompleted(
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

	const users = await userFinder.find(userId);

	return NextResponse.json(users.toPrimitives());
}
