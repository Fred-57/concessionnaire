import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { Breakdown } from "@domain/entities/Breakdown";
import { BreakdownAlreadyExistsError } from "@domain/errors/breakdown/BreakdownAlreadyExistsError";
import { Usecase } from "../Usecase";
import { PartRepository } from "@application/repositories/PartRepository";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { Part } from "@domain/entities/Part";

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

    await this.breakdownRepository.save(breakdown);
  }
}
