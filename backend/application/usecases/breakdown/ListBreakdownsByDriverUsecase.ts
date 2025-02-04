import { Breakdown } from "@domain/entities/Breakdown";
import { Usecase } from "../Usecase";
import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { DriverNotFoundError } from "@domain/errors/driver/DriverNotFoundError";

export class ListBreakdownsByDriverUsecase implements Usecase<Breakdown[]> {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository,
    private readonly driverRepository: DriverRepository
  ) {}

  public async execute(driverIdentifier: string): Promise<Breakdown[]> {
    const driver =
      await this.driverRepository.findByIdentifier(driverIdentifier);

    if (!driver) {
      throw new DriverNotFoundError();
    }

    const breakdowns =
      await this.breakdownRepository.findAllByDriverIdentifier(
        driverIdentifier
      );
    return breakdowns;
  }
}
