import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { PartRepository } from "@application/repositories/PartRepository";
import { Breakdown } from "@domain/entities/Breakdown";
import { BreakdownNotFoundError } from "@domain/errors/breakdown/BreakdownNotFoundError";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { Part } from "@domain/entities/Part";
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
      const breakdownPart =
        await this.breakdownRepository.findPartQuantityByBreakdownIdentifierAndPartIdentifier(
          breakdown.identifier,
          part.part.identifier
        );

      if (breakdownPart) {
        const quantityDifference = part.quantity - breakdownPart;
        const newStock = partExists.stock.value - quantityDifference;
        const updatedPart = Part.update(
          partExists,
          newStock,
          part.part.reference.value,
          part.part.name.value,
          part.part.cost.value
        );

        if (updatedPart instanceof Error) {
          throw updatedPart;
        }

        await this.partsRepository.update(updatedPart);
      } else {
        const quantity = partExists.stock.value - part.quantity;
        const updatedPart = Part.update(
          partExists,
          quantity,
          part.part.reference.value,
          part.part.name.value,
          part.part.cost.value
        );

        if (updatedPart instanceof Error) {
          throw updatedPart;
        }

        await this.partsRepository.update(updatedPart);
      }
    }
    await this.breakdownRepository.update(breakdown);
  }
}
