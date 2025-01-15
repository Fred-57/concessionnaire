import { Breakdown } from "@domain/entities/Breakdown";

export interface BreakdownRepository {
  save(breakdown: Breakdown): Promise<void>;
  findByIdentifier(identifier: string): Promise<Breakdown | null>;
  findAll(): Promise<Breakdown[]>;
  delete(breakdown: Breakdown): Promise<void>;
  findOneByRepairIdentifier(identifier: string): Promise<Breakdown | null>;
}
