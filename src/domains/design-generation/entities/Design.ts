import { UUID } from '@shared/value-objects/UUID';
import { ColorPalette } from '../value-objects/ColorPalette';
import { DesignStyleValue } from '../value-objects/DesignStyle';
import { DesignGenerated } from '../events/DesignGenerated';

export class Design {
  private constructor(
    private id: UUID,
    private userId: UUID,
    private imageUrl: string,
    private colorPalette: ColorPalette,
    private style: DesignStyleValue,
    private prompt: string,
    private metadataUri?: string,
    private tokenId?: number,
    private createdAt: Date = new Date()
  ) {}

  static create(
    userId: UUID,
    imageUrl: string,
    colorPalette: ColorPalette,
    style: DesignStyleValue,
    prompt: string
  ): { design: Design; event: DesignGenerated } {
    const design = new Design(
      UUID.create(),
      userId,
      imageUrl,
      colorPalette,
      style,
      prompt
    );

    const event = new DesignGenerated(design.id, design.userId, design.imageUrl);

    return { design, event };
  }

  static reconstitute(
    id: UUID,
    userId: UUID,
    imageUrl: string,
    colorPalette: ColorPalette,
    style: DesignStyleValue,
    prompt: string,
    metadataUri?: string,
    tokenId?: number,
    createdAt?: Date
  ): Design {
    return new Design(id, userId, imageUrl, colorPalette, style, prompt, metadataUri, tokenId, createdAt);
  }

  getId(): UUID {
    return this.id;
  }

  getUserId(): UUID {
    return this.userId;
  }

  getImageUrl(): string {
    return this.imageUrl;
  }

  getColorPalette(): ColorPalette {
    return this.colorPalette;
  }

  getStyle(): DesignStyleValue {
    return this.style;
  }

  getPrompt(): string {
    return this.prompt;
  }

  getMetadataUri(): string | undefined {
    return this.metadataUri;
  }

  getTokenId(): number | undefined {
    return this.tokenId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  linkNFT(metadataUri: string, tokenId: number): void {
    this.metadataUri = metadataUri;
    this.tokenId = tokenId;
  }

  isValid(): boolean {
    return (
      this.imageUrl.length > 0 &&
      this.prompt.length > 0 &&
      this.colorPalette.getColors().length > 0
    );
  }
}


