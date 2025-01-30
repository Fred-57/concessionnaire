import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { Breakdown } from "@domain/entities/Breakdown";
import { BreakdownAlreadyExistsError } from "@domain/errors/breakdown/BreakdownAlreadyExistsError";
import { Usecase } from "../Usecase";

export class CreateBreakdownUsecase implements Usecase<Breakdown> {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository
  ) {}

  public async execute(breakdown: Breakdown) {
    const existingBreakdown =
      await this.breakdownRepository.findByRentalIdentifierAndDate(
        breakdown.rentalIdentifier,
        breakdown.date.value
      );

    if (existingBreakdown) {
      throw new BreakdownAlreadyExistsError();
    }

    await this.breakdownRepository.save(breakdown);
  }
}
