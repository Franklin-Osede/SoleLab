export class ColorPalette {
  private constructor(private colors: string[]) {
    this.validate(colors);
  }

  static create(colors: string[]): ColorPalette {
    return new ColorPalette(colors);
  }

  private validate(colors: string[]): void {
    if (colors.length === 0) {
      throw new Error('Color palette must have at least one color');
    }

    if (colors.length > 10) {
      throw new Error('Color palette cannot have more than 10 colors');
    }

    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    colors.forEach((color) => {
      if (!hexColorRegex.test(color)) {
        throw new Error(`Invalid color format: ${color}. Must be hex color (e.g., #FF0000)`);
      }
    });
  }

  getColors(): string[] {
    return [...this.colors];
  }

  getPrimaryColor(): string {
    return this.colors[0];
  }

  getSecondaryColors(): string[] {
    return this.colors.slice(1);
  }

  equals(other: ColorPalette): boolean {
    if (this.colors.length !== other.colors.length) {
      return false;
    }
    return this.colors.every((color, index) => color === other.colors[index]);
  }
}


