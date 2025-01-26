import { Usecase } from "../Usecase";
import { Rental } from "@domain/entities/Rental";
import { RentalRepository } from "@application/repositories/RentalRepository";
import { RentalNotFoundError } from "@domain/errors/rental/RentalNotFoundError";

export class GetRentalUsecase implements Usecase<Rental> {
  public constructor(private readonly rentalRepository: RentalRepository) {}

  public async execute(identifier: string) {
    const rentalExists =
      await this.rentalRepository.findByIdentifier(identifier);

    if (!rentalExists) {
      throw new RentalNotFoundError();
    }

    return rentalExists;
  }
}
