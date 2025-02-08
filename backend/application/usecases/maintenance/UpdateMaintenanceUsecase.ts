import { Maintenance } from "@domain/entities/Maintenance";
import { Usecase } from "../Usecase";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { MaintenanceNotFoundError } from "@domain/errors/maintenance/MaintenanceNotFoundError";
import { PartRepository } from "@application/repositories/PartRepository";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { MotorcycleNotFoundError } from "@domain/errors/MotorcycleNotFoundError";
import { Part } from "@domain/entities/Part";

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

      const maintenancePart =
        await this.maintenanceRepository.findPartQuantityByMaintenanceIdentifierAndPartIdentifier(
          maintenance.identifier,
          part.part.identifier
        );
      if (maintenancePart) {
        const quantityDifference = part.quantity - maintenancePart;
        const newStock = partExists.stock.value - quantityDifference;
        const updatedPart = Part.update(
          partExists,
          newStock,
          part.part.reference.value,
          part.part.name.value,
          part.part.cost.value
        );
        if (updatedPart instanceof Error) {
          throw updatedPart;
        }
        await this.partRepository.update(updatedPart);
      } else {
        const newStock = partExists.stock.value - part.quantity;
        const updatedPart = Part.update(
          partExists,
          newStock,
          part.part.reference.value,
          part.part.name.value,
          part.part.cost.value
        );
        if (updatedPart instanceof Error) {
          throw updatedPart;
        }
        await this.partRepository.update(updatedPart);
      }
    }

    await this.maintenanceRepository.update(maintenance);
  }
}
