/**
 * Design Model
 * Modelo de datos para diseños de sneakers
 */
export interface Design {
  id: string;
  userId: string;
  imageUrl: string;
  style: string;
  colors: string[];
  prompt: string;
  metadataUri?: string;
  tokenId?: number;
  createdAt: string;
}

export interface GenerateDesignRequest {
  basePrompt: string;
  style: 'futuristic' | 'retro' | 'minimalist' | 'sporty' | 'luxury' | 'streetwear';
  colors: string[];
}

export interface GenerateDesignResponse {
  designId: string;
  imageUrl: string;
  prompt: string;
  style: string;
  colors: string[];
  createdAt: string;
}

export interface DesignFilters {
  style?: string;
  userId?: string;
  createdAfter?: string;
  createdBefore?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedDesignsResponse {
  data: Design[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  count?: number;
}

