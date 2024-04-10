import { Clock } from "../../../../src/contexts/shared/domain/Clock";

export class MockClock implements Clock {
	private readonly mockNow = jest.fn();

	now(): Date {
		expect(this.mockNow).toHaveBeenCalledWith();

		return this.mockNow() as Date;
	}

	shouldGenerate(date: Date): void {
		this.mockNow();
		this.mockNow.mockReturnValueOnce(date);
	}
}
