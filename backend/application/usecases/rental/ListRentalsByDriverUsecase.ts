import { Rental } from "@domain/entities/Rental";
import { Usecase } from "../Usecase";
import { RentalRepository } from "@application/repositories/RentalRepository";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { DriverNotFoundError } from "@domain/errors/driver/DriverNotFoundError";

export class ListRentalsByDriverUsecase implements Usecase<Rental[]> {
  public constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly driverRepository: DriverRepository
  ) {}

  public async execute(driverIdentifier: string) {
    const existingDriver =
      await this.driverRepository.findByIdentifier(driverIdentifier);

    if (!existingDriver) {
      throw new DriverNotFoundError();
    }

    const rentals =
      await this.rentalRepository.findManyByDriverIdentifier(driverIdentifier);

    return rentals;
  }
}
