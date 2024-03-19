import { Criteria } from "../../../shared/domain/criteria/Criteria";
import { CriteriaToSqlConverter } from "../../../shared/infrastructure/criteria/CriteriaToSqlConverter";
import { MariaDBConnection } from "../../../shared/infrastructure/MariaDBConnection";
import { User } from "../domain/User";
import { UserId } from "../domain/UserId";
import { UserRepository } from "../domain/UserRepository";

type DatabaseUser = {
	id: string;
	name: string;
	email: string;
	profile_picture: string;
	status: string;
};

export class MySqlUserRepository implements UserRepository {
	constructor(private readonly connection: MariaDBConnection) {}

	async save(user: User): Promise<void> {
		const userPrimitives = user.toPrimitives();

		const query = `
			INSERT INTO rrss__users (id, name, email, profile_picture, status)
			VALUES (
						   '${userPrimitives.id}',
						   '${userPrimitives.name}',
						   '${userPrimitives.email}',
						   '${userPrimitives.profilePicture}',
						   '${userPrimitives.status.valueOf()}'
				   );`;

		await this.connection.execute(query);
	}

	async search(id: UserId): Promise<User | null> {
		const query = `SELECT id, name, email, profile_picture FROM rrss__users WHERE id = '${id.value}';`;

		const result = await this.connection.searchOne<DatabaseUser>(query);

		if (!result) {
			return null;
		}

		return User.fromPrimitives({
			id: result.id,
			name: result.name,
			email: result.email,
			profilePicture: result.profile_picture,
			status: result.status,
		});
	}

	async matching(criteria: Criteria): Promise<User[]> {
		await new Promise((resolve) => {
			setTimeout(resolve, 3000);
		});

		const converter = new CriteriaToSqlConverter();

		const result = await this.connection.searchAll<DatabaseUser>(
			converter.convert(["id", "name", "email", "profile_picture"], "rrss__users", criteria, {
				fullname: "name",
			}),
		);

		return result.map((user) =>
			User.fromPrimitives({
				id: user.id,
				name: user.name,
				email: user.email,
				profilePicture: user.profile_picture,
				status: user.status,
			}),
		);
	}
}
