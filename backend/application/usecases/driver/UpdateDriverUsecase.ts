import { Driver } from "@domain/entities/Driver";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { Usecase } from "../Usecase";
import { DriverNotFoundError } from "@domain/errors/driver/DriverNotFoundError";

export class UpdateDriverUsecase implements Usecase<Driver> {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public async execute(driver: Driver) {
    const driverExists = await this.driverRepository.findByIdentifier(
      driver.identifier,
    );

    if (!driverExists) {
      throw new DriverNotFoundError();
    }

    await this.driverRepository.update(driver);
  }
}
