import { DomainEvent } from "./DomainEvent";

export type DomainEventClass<T extends DomainEvent = DomainEvent> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (...args: any[]): T;
	eventName: string;
};
