import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

import { OllamaMistralCourseSuggestionsRepository } from "../../../../../contexts/mooc/course_suggestions/infrastructure/OllamaMistralCourseSuggestionsRepository";
import { UserFinder } from "../../../../../contexts/mooc/users/application/find/UserFinder";
import { MySqlUserRepository } from "../../../../../contexts/mooc/users/infrastructure/MySqlUserRepository";
import { MariaDBConnection } from "../../../../../contexts/shared/infrastructure/MariaDBConnection";

const finder = new UserFinder(
	new MySqlUserRepository(new MariaDBConnection(), new OllamaMistralCourseSuggestionsRepository()),
);

export async function GET(_request: Request, context: { params: Params }): Promise<NextResponse> {
	const userId = context.params.user_id as string;

	const users = await finder.find(userId);

	return NextResponse.json(users.toPrimitives());
}
