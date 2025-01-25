import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { Breakdown } from "@domain/entities/Breakdown";
import { BreakdownAlreadyExistsError } from "@domain/errors/breakdown/BreakdownAlreadyExistsError";
import { Usecase } from "../Usecase";

export class CreateBreakdownUsecase implements Usecase<Breakdown> {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository
  ) {}

  public async execute(breakdown: Breakdown) {
    const breakdowns = await this.breakdownRepository.findAll();

    const hasBreakdown = breakdowns.some(
      (b) => b.rentalIdentifier === breakdown.rentalIdentifier
    );

    const hasSimilarBreakdown = breakdowns.some(
      (b) =>
        b.date.getTime() === breakdown.date.getTime() &&
        b.description === breakdown.description &&
        breakdown.rentalIdentifier === breakdown.rentalIdentifier
    );

    if (hasBreakdown || hasSimilarBreakdown) {
      throw new BreakdownAlreadyExistsError();
    }

    await this.breakdownRepository.save(breakdown);
  }
}
