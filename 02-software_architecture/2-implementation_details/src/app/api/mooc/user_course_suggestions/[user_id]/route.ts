import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

import { UserCourseSuggestionsSearcher } from "../../../../../contexts/mooc/user_course_suggestions/application/search/UserCourseSuggestionsSearcher";
import { OllamaMistralUserCourseSuggestionsRepository } from "../../../../../contexts/mooc/user_course_suggestions/infrastructure/OllamaMistralUserCourseSuggestionsRepository";
import { MySqlUserRepository } from "../../../../../contexts/mooc/users/infrastructure/MySqlUserRepository";
import { MariaDBConnection } from "../../../../../contexts/shared/infrastructure/MariaDBConnection";

const searcher = new UserCourseSuggestionsSearcher(
	new OllamaMistralUserCourseSuggestionsRepository(
		new MySqlUserRepository(new MariaDBConnection()),
	),
);

export async function GET(_request: Request, context: { params: Params }): Promise<NextResponse> {
	const userId = context.params.user_id as string;

	const userCourseSuggestions = await searcher.search(userId);

	return NextResponse.json(userCourseSuggestions?.toPrimitives() ?? {});
}
