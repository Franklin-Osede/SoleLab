import { UUID } from '@shared/value-objects/UUID';
import { Design } from '../entities/Design';

export interface IDesignRepository {
  save(design: Design): Promise<void>;
  findById(id: UUID): Promise<Design | null>;
  findByUserId(userId: UUID): Promise<Design[]>;
  findAll(): Promise<Design[]>;
}


