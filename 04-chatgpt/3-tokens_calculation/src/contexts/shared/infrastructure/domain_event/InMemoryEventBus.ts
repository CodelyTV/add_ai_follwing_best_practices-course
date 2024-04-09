/* eslint-disable @typescript-eslint/ban-types,no-console */
import { DomainEvent } from "../../domain/event/DomainEvent";
import { DomainEventSubscriber } from "../../domain/event/DomainEventSubscriber";
import { EventBus } from "../../domain/event/EventBus";

export class InMemoryEventBus implements EventBus {
	private readonly subscriptions: Map<string, { subscriber: Function; name: string }[]> = new Map();

	constructor(subscribers: DomainEventSubscriber<DomainEvent>[]) {
		this.registerSubscribers(subscribers);
	}

	async publish(events: DomainEvent[]): Promise<void> {
		const executions: unknown[] = [];

		events.forEach((event) => {
			console.log(`\n📤 ${event.eventName}`);
			const subscribers = this.subscriptions.get(event.eventName);

			if (subscribers) {
				subscribers.forEach((subscriber) => {
					console.log(`  → 💻 ${subscriber.name}`);

					executions.push(subscriber.subscriber(event));
				});
			}
		});

		await Promise.all(executions).catch((error) => {
			console.error("Executing subscriptions:", error);
		});
	}

	private registerSubscribers(subscribers: DomainEventSubscriber<DomainEvent>[]): void {
		subscribers.forEach((subscriber) => {
			subscriber.subscribedTo().forEach((event) => {
				this.subscribe(event.eventName, subscriber);
			});
		});
	}

	private subscribe(eventName: string, subscriber: DomainEventSubscriber<DomainEvent>): void {
		const currentSubscriptions = this.subscriptions.get(eventName);
		const subscription = { subscriber: subscriber.on.bind(subscriber), name: subscriber.name() };

		if (currentSubscriptions) {
			currentSubscriptions.push(subscription);
		} else {
			this.subscriptions.set(eventName, [subscription]);
		}
	}
}
