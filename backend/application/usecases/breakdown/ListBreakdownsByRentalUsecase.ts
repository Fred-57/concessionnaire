import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { RentalRepository } from "@application/repositories/RentalRepository";
import { RentalNotFoundError } from "@domain/errors/rental/RentalNotFoundError";

export class ListBreakdownsByRentalUseCase {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository,
    private readonly rentalRepository: RentalRepository
  ) {}

  public async execute(rentalIdentifier: string) {
    const rental =
      await this.rentalRepository.findByIdentifier(rentalIdentifier);

    if (!rental) {
      throw new RentalNotFoundError();
    }

    return this.breakdownRepository.findByRentalIdentifier(rentalIdentifier);
  }
}
