import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { Breakdown } from "@domain/entities/Breakdown";
import { BreakdownAlreadyExistsError } from "@domain/errors/breakdown/BreakdownAlreadyExistsError";
import { Usecase } from "../Usecase";
import { PartRepository } from "@application/repositories/PartRepository";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";

export class CreateBreakdownUsecase implements Usecase<Breakdown> {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository,
    private readonly partsRepository: PartRepository
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

    for (const part of breakdown.parts) {
      const partExists = await this.partsRepository.findByIdentifier(
        part.part.identifier
      );

      if (!partExists) {
        throw new PartNotFoundError();
      }
    }

    await this.breakdownRepository.save(breakdown);
  }
}
