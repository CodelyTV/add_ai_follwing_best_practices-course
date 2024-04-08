import { DomainEvent } from "./DomainEvent";

export abstract class EventBus {
	abstract publish(events: DomainEvent[]): Promise<void>;
}
