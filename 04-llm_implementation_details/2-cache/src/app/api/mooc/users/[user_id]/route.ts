import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

import { OllamaMistralUserCourseSuggestionsRepository } from "../../../../../contexts/mooc/user_course_suggestions/infrastructure/OllamaMistralUserCourseSuggestionsRepository";
import { UserFinder } from "../../../../../contexts/mooc/users/application/find/UserFinder";
import { MySqlUserRepository } from "../../../../../contexts/mooc/users/infrastructure/MySqlUserRepository";
import { MariaDBConnection } from "../../../../../contexts/shared/infrastructure/MariaDBConnection";

const finder = new UserFinder(
	new MySqlUserRepository(
		new MariaDBConnection(),
		new OllamaMistralUserCourseSuggestionsRepository(),
	),
);

export async function GET(_request: Request, context: { params: Params }): Promise<NextResponse> {
	const userId = context.params.user_id as string;

	const users = await finder.find(userId);

	return NextResponse.json(users.toPrimitives());
}
