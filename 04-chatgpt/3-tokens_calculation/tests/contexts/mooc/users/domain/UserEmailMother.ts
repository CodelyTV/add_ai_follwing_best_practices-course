import { faker } from "@faker-js/faker";

import { UserEmail } from "../../../../../src/contexts/mooc/users/domain/UserEmail";

export class UserEmailMother {
	static create(value?: string): UserEmail {
		return new UserEmail(value ?? faker.internet.email());
	}
}
