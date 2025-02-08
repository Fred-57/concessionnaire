import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { DateBehindNowError } from "@domain/errors/DateBehindNowError";
import { MotorcycleNotFoundError } from "@domain/errors/MotorcycleNotFoundError";
import { MaintenanceTotalCostLessThanZeroError } from "@domain/errors/maintenance/MaintenanceTotalCostLessThanZeroError";
import { Usecase } from "../Usecase";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { PartRepository } from "@application/repositories/PartRepository";
import { MaintenanceAlreadyExistsError } from "@domain/errors/maintenance/MaintenanceAlreadyExistsError";
import { Part } from "@domain/entities/Part";

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

    const existingMaintenance =
      await this.maintenanceRepository.findByMotorcycleAndDate(
        maintenance.motorcycleIdentifier,
        maintenance.date
      );

    if (existingMaintenance) {
      throw new MaintenanceAlreadyExistsError();
    }

    for (const part of maintenance.parts) {
      const partExists = await this.partRepository.findByIdentifier(
        part.part.identifier
      );
      if (!partExists) {
        throw new PartNotFoundError();
      }
      const quantity = partExists.stock.value - part.quantity;
      const updatedPart = Part.update(
        partExists,
        quantity,
        part.part.reference.value,
        part.part.name.value,
        part.part.cost.value
      );

      if (updatedPart instanceof Error) {
        throw updatedPart;
      }
      await this.partRepository.update(updatedPart);
    }
    await this.maintenanceRepository.save(maintenance);
  }
}
