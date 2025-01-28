import { Maintenance } from "@domain/entities/Maintenance";
import { Usecase } from "../Usecase";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { MaintenanceNotFoundError } from "@domain/errors/maintenance/MaintenanceNotFoundError";
import { PartRepository } from "@application/repositories/PartRepository";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { DateBehindNowError } from "@domain/errors/DateBehindNowError";
import { MaintenanceTotalCostLessThanZeroError } from "@domain/errors/maintenance/MaintenanceTotalCostLessThanZeroError";
import { MotorcycleNotFoundError } from "@domain/errors/MotorcycleNotFoundError";

export class UpdateMaintenanceUsecase implements Usecase<Maintenance> {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly partRepository: PartRepository
  ) {}

  public async execute(maintenance: Maintenance) {
    const maintenanceExists = await this.maintenanceRepository.findByIdentifier(
      maintenance.identifier
    );

    if (!maintenanceExists) {
      throw new MaintenanceNotFoundError();
    }

    if (maintenance.motorcycleIdentifier === null) {
      throw new MotorcycleNotFoundError();
    }

    for (const part of maintenance.parts) {
      const partExists = await this.partRepository.findByIdentifier(
        part.part.identifier
      );
      if (!partExists) {
        throw new PartNotFoundError();
      }
    }

    await this.maintenanceRepository.update(maintenance);
  }
}
