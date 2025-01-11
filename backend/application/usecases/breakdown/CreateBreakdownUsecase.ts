import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { Breakdown } from "@domain/entities/Breakdown";
import { BreakdownAlreadyExistsError } from "@domain/errors/breakdown/BreakdownAlreadyExistsError";
import { Usecase } from "../Usecase";

export class CreateBreakdownUsecase implements Usecase {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository
  ) {}

  public async execute(breakdown: Breakdown) {
    const breakdowns = await this.breakdownRepository.findAll();

    const hasBreakdown = breakdowns.some(
      (b) =>
        b.rentalIdentifier === breakdown.rentalIdentifier &&
        b.date.getTime() === breakdown.date.getTime()
    );

    const hasSimilarBreakdown = breakdowns.some(
      (b) =>
        b.rentalIdentifier === breakdown.rentalIdentifier &&
        b.date.getTime() === breakdown.date.getTime() &&
        b.description === breakdown.description
    );

    if (hasBreakdown || hasSimilarBreakdown) {
      throw new BreakdownAlreadyExistsError();
    }

    await this.breakdownRepository.save(breakdown);
  }
}
