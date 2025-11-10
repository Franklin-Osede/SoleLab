import { UUID } from '../value-objects/UUID';

export abstract class DomainEvent {
  public readonly eventId: UUID;
  public readonly occurredOn: Date;
  public readonly aggregateId: UUID;

  constructor(aggregateId: UUID) {
    this.eventId = UUID.create();
    this.occurredOn = new Date();
    this.aggregateId = aggregateId;
  }

  abstract eventName(): string;
}


