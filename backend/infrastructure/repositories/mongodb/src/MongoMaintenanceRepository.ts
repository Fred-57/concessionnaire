import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";

export class MongoMaintenanceRepository implements MaintenanceRepository {
  public async findAll(): Promise<Maintenance[]> {
    return [];
  }
}
