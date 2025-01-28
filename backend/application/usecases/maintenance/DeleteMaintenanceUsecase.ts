import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceNotFoundError } from "@domain/errors/maintenance/MaintenanceNotFoundError";
import { Usecase } from "../Usecase";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";

export class DeleteMaintenanceUsecase implements Usecase<Maintenance> {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  public async execute(identifier: string) {
    const maintenance =
      await this.maintenanceRepository.findByIdentifier(identifier);

    if (!maintenance) {
      throw new MaintenanceNotFoundError();
    }

    await this.maintenanceRepository.delete(maintenance);
  }
}
