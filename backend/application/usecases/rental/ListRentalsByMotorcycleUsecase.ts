import { Rental } from "@domain/entities/Rental";
import { Usecase } from "../Usecase";
import { RentalRepository } from "@application/repositories/RentalRepository";
import { MotorcycleRepository } from "@application/repositories/MotorcycleRepository";
import { MotorcycleNotFoundError } from "@domain/errors/MotorcycleNotFoundError";

export class ListRentalsByMotorcycleUsecase implements Usecase<Rental[]> {
  public constructor(
    private readonly rentalRepository: RentalRepository,
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(motorcycleIdentifier: string) {
    const existingMotorcycle =
      await this.motorcycleRepository.findByIdentifier(motorcycleIdentifier);

    if (!existingMotorcycle) {
      throw new MotorcycleNotFoundError();
    }

    const rentals =
      await this.rentalRepository.findManyByMotorcycleIdentifier(
        motorcycleIdentifier
      );

    return rentals;
  }
}
