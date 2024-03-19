import { NextRequest, NextResponse } from "next/server";

import { UserSearcher } from "../../../contexts/rrss/users/application/search/UserSearcher";
import { MySqlUserRepository } from "../../../contexts/rrss/users/infrastructure/MySqlUserRepository";
import { MariaDBConnection } from "../../../contexts/shared/infrastructure/MariaDBConnection";

const searcher = new UserSearcher(new MySqlUserRepository(new MariaDBConnection()));

export async function GET(request: NextRequest, id: string): Promise<NextResponse> {
	const user = await searcher.search(id);

	if (user === null) {
		return NextResponse.error();
	}

	return NextResponse.json(user.toPrimitives());
}
