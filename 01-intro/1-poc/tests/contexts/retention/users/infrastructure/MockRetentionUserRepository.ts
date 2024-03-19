import { RetentionUser } from "../../../../../src/contexts/retention/users/domain/RetentionUser";
import { RetentionUserRepository } from "../../../../../src/contexts/retention/users/domain/RetentionUserRepository";
import { UserId } from "../../../../../src/contexts/rrss/users/domain/UserId";

export class MockRetentionUserRepository implements RetentionUserRepository {
	private readonly mockSave = jest.fn();
	private readonly mockSearch = jest.fn();

	async save(user: RetentionUser): Promise<void> {
		expect(this.mockSave).toHaveBeenCalledWith(user.toPrimitives());

		return Promise.resolve();
	}

	async search(id: UserId): Promise<RetentionUser | null> {
		expect(this.mockSearch).toHaveBeenCalledWith(id);

		return this.mockSearch() as Promise<RetentionUser | null>;
	}

	shouldSave(user: RetentionUser): void {
		this.mockSave(user.toPrimitives());
	}

	shouldSearch(user: RetentionUser): void {
		this.mockSearch(user.id);
		this.mockSearch.mockReturnValueOnce(user);
	}

	shouldSearchAndReturnNull(id: UserId): void {
		this.mockSearch(id);
		this.mockSearch.mockReturnValueOnce(null);
	}
}
