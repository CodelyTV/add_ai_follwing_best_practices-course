import { DomainEvent } from "./DomainEvent";
import { DomainEventClass } from "./DomainEventClass";

export interface DomainEventSubscriber<T extends DomainEvent> {
	on(domainEvent: T): Promise<void>;

	subscribedTo(): DomainEventClass[];

	name(): string;
}
