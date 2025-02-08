import { Maintenance } from "@domain/entities/Maintenance";
import { Usecase } from "../Usecase";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { MotorcycleRepository } from "@application/repositories/MotorcycleRepository";
import { MotorcycleNotFoundError } from "@domain/errors/MotorcycleNotFoundError";

export class ListMaintenancesByMotorcycleUsecase
  implements Usecase<Maintenance[]>
{
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(motorcycleIdentifier: string): Promise<Maintenance[]> {
    const motorcycle =
      await this.motorcycleRepository.findByIdentifier(motorcycleIdentifier);

    if (!motorcycle) {
      throw new MotorcycleNotFoundError();
    }

    const maintenances =
      await this.maintenanceRepository.findByMotorcycleIdentifier(
        motorcycleIdentifier
      );
    return maintenances;
  }
}
