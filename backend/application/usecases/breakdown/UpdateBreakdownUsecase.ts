import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { Breakdown } from "@domain/entities/Breakdown";
import { BreakdownNotFoundError } from "@domain/errors/breakdown/BreakdownNotFoundError";

export class UpdateBreakdownUsecase {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository
  ) {}

  public async execute(breakdown: Breakdown) {
    const existingBreakdown = await this.breakdownRepository.findByIdentifier(
      breakdown.identifier
    );

    if (!existingBreakdown) {
      throw new BreakdownNotFoundError();
    }

    await this.breakdownRepository.update(breakdown);
  }
}
