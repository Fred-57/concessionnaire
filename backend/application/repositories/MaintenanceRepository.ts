import { Maintenance } from "@domain/entities/Maintenance";

export interface MaintenanceRepository {
  save(rental: Maintenance): Promise<void>;
  findByIdentifier(identifier: string): Promise<Maintenance | null>;
  findByMotorcycleIdentifier(identifier: string): Promise<Maintenance[]>;
  findAll(): Promise<Maintenance[]>;
  delete(rental: Maintenance): Promise<void>;
}
