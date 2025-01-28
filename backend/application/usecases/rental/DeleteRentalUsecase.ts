import { Usecase } from "../Usecase";
import { Rental } from "@domain/entities/Rental";
import { RentalRepository } from "@application/repositories/RentalRepository";
import { RentalNotFoundError } from "@domain/errors/rental/RentalNotFoundError";

export class DeleteRentalUsecase implements Usecase<Rental> {
  public constructor(private readonly rentalRepository: RentalRepository) {}

  public async execute(rental: Rental) {
    const rentalExists = await this.rentalRepository.findByIdentifier(
      rental.identifier
    );

    if (!rentalExists) {
      throw new RentalNotFoundError();
    }

    await this.rentalRepository.delete(rental);
  }
}
