import { DomainEvent } from "../../../../src/contexts/shared/domain/event/DomainEvent";
import { EventBus } from "../../../../src/contexts/shared/domain/event/EventBus";

export class MockEventBus implements EventBus {
	private readonly mockPublish = jest.fn();

	async publish(events: DomainEvent[]): Promise<void> {
		expect(this.mockPublish).toHaveBeenCalledWith(
			expect.arrayContaining(
				events.map((event) =>
					expect.objectContaining({
						...event,
						occurredOn: expect.anything(),
						eventId: expect.anything(),
					}),
				),
			),
		);

		return Promise.resolve();
	}

	shouldPublish(events: DomainEvent[]): void {
		this.mockPublish(events);
	}
}
