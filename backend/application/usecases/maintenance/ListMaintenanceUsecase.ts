import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { Usecase } from "../Usecase";

export class ListMaintenancesUsecase implements Usecase<Maintenance[]> {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  public async execute() {
    const maintenances = await this.maintenanceRepository.findAll();
    return maintenances;
  }
}
