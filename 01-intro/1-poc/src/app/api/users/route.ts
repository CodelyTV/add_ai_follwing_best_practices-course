import { NextRequest, NextResponse } from "next/server";

import { UsersByCriteriaSearcher } from "../../../contexts/rrss/users/application/search_by_criteria/UsersByCriteriaSearcher";
import { MySqlUserRepository } from "../../../contexts/rrss/users/infrastructure/MySqlUserRepository";
import { RedisCacheUserRepository } from "../../../contexts/rrss/users/infrastructure/RedisCacheUserRepository";
import { SearchParamsCriteriaFiltersParser } from "../../../contexts/shared/infrastructure/criteria/SearchParamsCriteriaFiltersParser";
import { MariaDBConnection } from "../../../contexts/shared/infrastructure/MariaDBConnection";
import { RedisClient } from "../../../contexts/shared/infrastructure/RedisClient";

const searcher = new UsersByCriteriaSearcher(
	new RedisCacheUserRepository(new MySqlUserRepository(new MariaDBConnection()), new RedisClient()),
);

export async function GET(request: NextRequest): Promise<NextResponse> {
	// eslint-disable-next-line no-console
	console.log("Pidiendo /api/users");

	const { searchParams } = new URL(request.url);

	const filters = SearchParamsCriteriaFiltersParser.parse(searchParams);

	const users = await searcher.search(
		filters,
		searchParams.get("orderBy"),
		searchParams.get("order"),
		searchParams.has("pageSize") ? parseInt(searchParams.get("pageSize") as string, 10) : null,
		searchParams.has("pageNumber") ? parseInt(searchParams.get("pageNumber") as string, 10) : null,
	);

	const response = NextResponse.json(users.map((user) => user.toPrimitives()));
	response.headers.set("Cache-Control", "max-age=3600, s-maxage=6000");

	return response;
}
