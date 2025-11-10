import { DomainEvent } from '@shared/events/DomainEvent';
import { UUID } from '@shared/value-objects/UUID';

export class DesignGenerated extends DomainEvent {
  constructor(
    aggregateId: UUID,
    public readonly userId: UUID,
    public readonly imageUrl: string
  ) {
    super(aggregateId);
  }

  eventName(): string {
    return 'DesignGenerated';
  }
}


