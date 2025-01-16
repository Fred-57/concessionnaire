import { PartOrderHistory } from "@domain/entities/PartOrderHistory";

export interface PartOrderHistoryRepository {
  save(partOrderHistory: PartOrderHistory): Promise<void>;
  update(partOrderHistory: PartOrderHistory): Promise<void>;
  findByIdentifier(identifier: string): Promise<PartOrderHistory | null>;
  findAll(): Promise<PartOrderHistory[]>;
  delete(partOrderHistory: PartOrderHistory): Promise<void>;
}
