import { Maintenance } from "@domain/entities/Maintenance";

export interface MaintenanceRepository {
  save(maintenance: Maintenance): Promise<void>;
  findByIdentifier(identifier: string): Promise<Maintenance | null>;
  findByMotorcycleIdentifier(identifier: string): Promise<Maintenance[]>;
  findAll(): Promise<Maintenance[]>;
  delete(maintenance: Maintenance): Promise<void>;
}
