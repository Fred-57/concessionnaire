import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { PartRepository } from "@application/repositories/PartRepository";
import { Breakdown } from "@domain/entities/Breakdown";
import { BreakdownNotFoundError } from "@domain/errors/breakdown/BreakdownNotFoundError";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";

export class UpdateBreakdownUsecase {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository,
    private readonly partsRepository: PartRepository
  ) {}

  public async execute(breakdown: Breakdown) {
    const existingBreakdown = await this.breakdownRepository.findByIdentifier(
      breakdown.identifier
    );

    if (!existingBreakdown) {
      throw new BreakdownNotFoundError();
    }

    for (const part of breakdown.parts) {
      const partExists = await this.partsRepository.findByIdentifier(
        part.part.identifier
      );

      if (!partExists) {
        throw new PartNotFoundError();
      }
    }

    await this.breakdownRepository.update(breakdown);
  }
}
