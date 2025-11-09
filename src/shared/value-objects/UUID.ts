import { randomUUID } from 'crypto';

export class UUID {
  private constructor(private value: string) {
    this.validate(value);
  }

  static create(value?: string): UUID {
    return new UUID(value || randomUUID());
  }

  static fromString(value: string): UUID {
    return new UUID(value);
  }

  private validate(value: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new Error('Invalid UUID format');
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: UUID): boolean {
    return this.value === other.value;
  }
}


