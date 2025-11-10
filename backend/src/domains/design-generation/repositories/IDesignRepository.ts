import { UUID } from '@shared/value-objects/UUID';
import { Design } from '../entities/Design';

export interface IDesignRepository {
  save(design: Design): Promise<void>;
  findById(id: UUID): Promise<Design | null>;
  findByUserId(userId: UUID): Promise<Design[]>;
  findAll(): Promise<Design[]>;
  findAllPaginated(page: number, pageSize: number): Promise<{ designs: Design[]; total: number }>;
  findByFilters(filters: {
    style?: string;
    userId?: UUID;
    createdAfter?: Date;
    createdBefore?: Date;
  }): Promise<Design[]>;
}


