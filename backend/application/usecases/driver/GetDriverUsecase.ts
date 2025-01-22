import { Driver } from "@domain/entities/Driver";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { Usecase } from "../Usecase";
import { DriverNotFoundError } from "@domain/errors/driver/DriverNotFoundError";

export class GetDriverUsecase implements Usecase<Driver> {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public async execute(identifier: string) {
    const driver = await this.driverRepository.findByIdentifier(identifier);

    if (!driver) {
      throw new DriverNotFoundError();
    }

    return driver;
  }
}
