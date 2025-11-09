export enum DesignStyle {
  FUTURISTIC = 'futuristic',
  RETRO = 'retro',
  MINIMALIST = 'minimalist',
  SPORTY = 'sporty',
  LUXURY = 'luxury',
  STREETWEAR = 'streetwear',
}

export class DesignStyleValue {
  private constructor(private style: DesignStyle) {}

  static create(style: string): DesignStyleValue {
    const validStyle = Object.values(DesignStyle).find(
      (s) => s === style.toLowerCase()
    ) as DesignStyle;

    if (!validStyle) {
      throw new Error(
        `Invalid design style: ${style}. Must be one of: ${Object.values(DesignStyle).join(', ')}`
      );
    }

    return new DesignStyleValue(validStyle);
  }

  getValue(): DesignStyle {
    return this.style;
  }

  toString(): string {
    return this.style;
  }

  equals(other: DesignStyleValue): boolean {
    return this.style === other.style;
  }
}


