import { Maintenance } from "@domain/entities/Maintenance";

export interface MaintenanceRepository {
  save(maintenance: Maintenance): Promise<void>;
  findByIdentifier(identifier: string): Promise<Maintenance | null>;
  findByMotorcycleIdentifier(identifier: string): Promise<Maintenance[]>;
  findByMotorcycleAndDate(
    identifier: string,
    date: Date
  ): Promise<Maintenance | null>;
  findAll(): Promise<Maintenance[]>;
  delete(maintenance: Maintenance): Promise<void>;
  update(maintenance: Maintenance): Promise<void>;
  findPartQuantityByMaintenanceIdentifierAndPartIdentifier(
    maintenanceIdentifier: string,
    partIdentifier: string
  ): Promise<number>;
}
