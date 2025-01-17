import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { DateBehindNowError } from "@domain/errors/DateBehindNowError";
import { MotorcycleNotFoundError } from "@domain/errors/MotorcycleNotFoundError";
import { Usecase } from "../Usecase";

export class CreateMaintenanceUsecase implements Usecase {
  public constructor(
    private readonly maintenanceRepository: MaintenanceRepository
  ) {}

  public async execute(maintenance: Maintenance) {
    if (maintenance.date < new Date()) {
      throw new DateBehindNowError();
    }

    if (maintenance.motorcycleIdentifier === null) {
      throw new MotorcycleNotFoundError();
    }

    await this.maintenanceRepository.save(maintenance);
  }
}
