import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { DateBehindNowError } from "@domain/errors/DateBehindNowError";
import { MotorcycleNotFoundError } from "@domain/errors/MotorcycleNotFoundError";
import { MaintenanceTotalCostLessThanZeroError } from "@domain/errors/maintenance/MaintenanceTotalCostLessThanZeroError";
import { Usecase } from "../Usecase";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { PartRepository } from "@application/repositories/PartRepository";

export class CreateMaintenanceUsecase implements Usecase<Maintenance> {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly partRepository: PartRepository
  ) {}

  public async execute(maintenance: Maintenance) {
    if (maintenance.date < new Date()) {
      throw new DateBehindNowError();
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
    await this.maintenanceRepository.save(maintenance);
  }
}
