import { RedisCacheUserRepository } from "../../../../../src/contexts/rrss/users/infrastructure/RedisCacheUserRepository";
import { RedisClient } from "../../../../../src/contexts/shared/infrastructure/RedisClient";
import { CriteriaMother } from "../../../shared/domain/criteria/CriteriaMother";
import { UserMother } from "../domain/UserMother";
import { MockUserRepository } from "./MockUserRepository";

describe("RedisCacheUserRepository should", () => {
	const innerRepository = new MockUserRepository();
	const redisClient = new RedisClient();
	const repository = new RedisCacheUserRepository(innerRepository, redisClient);

	beforeEach(async () => await redisClient.flushAll());

	it("return existing user searching by criteria when not in cache and store it", async () => {
		const javi = UserMother.create({ name: "Javi" });
		const expectedUsers = [javi];

		const criteria = CriteriaMother.withOneFilter("name", "EQUAL", "Javi");

		innerRepository.shouldMatch(criteria, expectedUsers);

		expect(await repository.matching(criteria)).toStrictEqual(expectedUsers);
	});

	it("return existing user searching by criteria from cache", async () => {
		const javi = UserMother.create({ name: "Javi" });
		const expectedUsers = [javi];

		const criteria = CriteriaMother.withOneFilter("name", "EQUAL", "Javi");

		innerRepository.shouldMatch(criteria, expectedUsers);

		expect(await repository.matching(criteria)).toStrictEqual(expectedUsers);
		expect(await repository.matching(criteria)).toStrictEqual(expectedUsers);
	});
});
