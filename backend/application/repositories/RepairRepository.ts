import { Repair } from "@domain/entities/Repair";

export interface RepairRepository {
  save(repair: Repair): Promise<void>;
  findByIdentifier(identifier: string): Promise<Repair | null>;
  findByMotorcycleIdentifier(identifier: string): Promise<Repair[]>;
  findAll(): Promise<Repair[]>;
  delete(repair: Repair): Promise<void>;
  findOneByMaintenanceIdentifier(identifier: string): Promise<Repair | null>;
}
