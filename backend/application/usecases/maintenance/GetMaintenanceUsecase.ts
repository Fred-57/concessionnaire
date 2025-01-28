import { Maintenance } from "@domain/entities/Maintenance";
import { Usecase } from "../Usecase";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { MaintenanceNotFoundError } from "@domain/errors/maintenance/MaintenanceNotFoundError";
export class GetMaintenanceUsecase implements Usecase<Maintenance> {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  public async execute(identifier: string) {
    const maintenance =
      await this.maintenanceRepository.findByIdentifier(identifier);

    if (!maintenance) {
      throw new MaintenanceNotFoundError();
    }

    return maintenance;
  }
}
