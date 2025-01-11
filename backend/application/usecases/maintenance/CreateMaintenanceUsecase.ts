import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { MaintenanceCostLessThanZero } from "@domain/errors/maintenance/MaintenanceCostLessThanZero";
import { MaintenanceReplacedPartsNotFound } from "@domain/errors/maintenance/MaintenanceReplacedPartsNotFound";
import { Usecase } from "../Usecase";

export class CreateMaintenanceUsecase implements Usecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  public async execute(maintenance: Maintenance) {
    if (maintenance.cost < 0) {
      throw new MaintenanceCostLessThanZero();
    }

    if (maintenance.replacedParts.length === 0) {
      throw new MaintenanceReplacedPartsNotFound();
    }

    await this.maintenanceRepository.save(maintenance);
  }
}
