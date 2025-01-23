import { DriverRepository } from "@application/repositories/DriverRepository";
import { Driver } from "@domain/entities/Driver";
import { Usecase } from "../Usecase";
import { DriverNotFoundError } from "@domain/errors/driver/DriverNotFoundError";

export class DeleteDriverUsecase implements Usecase<Driver> {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public async execute(identifier: string) {
    const driver = await this.driverRepository.findByIdentifier(identifier);

    if (!driver) {
      throw new DriverNotFoundError();
    }

    await this.driverRepository.delete(driver);
  }
}
