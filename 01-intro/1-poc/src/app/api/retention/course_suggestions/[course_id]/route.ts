import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

import { CourseSuggestionsPredictor } from "../../../../../contexts/retention/course_suggestions/application/generate/CourseSuggestionsPredictor";
import { GemmaCoursesSuggestionModel } from "../../../../../contexts/retention/course_suggestions/infrastructure/GemmaCoursesSuggestionModel";
import { UserFinder } from "../../../../../contexts/rrss/users/application/find/UserFinder";
import { MySqlUserRepository } from "../../../../../contexts/rrss/users/infrastructure/MySqlUserRepository";
import { MariaDBConnection } from "../../../../../contexts/shared/infrastructure/MariaDBConnection";

const predictor = new CourseSuggestionsPredictor(
	new UserFinder(new MySqlUserRepository(new MariaDBConnection())),
	new GemmaCoursesSuggestionModel(),
);

export async function GET(_request: Request, context: { params: Params }): Promise<NextResponse> {
	const courseId = context.params.course_id as string;

	const courseSuggestions = await predictor.predict(courseId);

	return NextResponse.json(courseSuggestions.map((suggestion) => suggestion.toPrimitives()));
}
