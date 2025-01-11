import { RentalRepository } from "@application/repositories/RentalRepository";
import { Rental } from "@domain/entities/Rental";
import { RentalAlreadyExistsError } from "@domain/errors/rental/RentalAlreadyExistsError";
import { Usecase } from "../Usecase";

export class CreateRentalUsecase implements Usecase {
  public constructor(private readonly rentalRepository: RentalRepository) {}

  public async execute(rental: Rental) {
    const rentals = await this.rentalRepository.findAll();

    const hasRental = rentals.some(
      (r) => r.driverIdentifier === rental.driverIdentifier
    );

    const hasSimilarRental = rentals.some(
      (r) =>
        r.driverIdentifier === rental.driverIdentifier &&
        r.motorcycleIdentifier === rental.motorcycleIdentifier &&
        r.startDate.getTime() === rental.startDate.getTime() &&
        r.durationInMonths.value === rental.durationInMonths.value
    );

    if (hasRental || hasSimilarRental) {
      throw new RentalAlreadyExistsError();
    }

    await this.rentalRepository.save(rental);
  }
}
