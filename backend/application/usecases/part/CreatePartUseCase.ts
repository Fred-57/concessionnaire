import { Part } from "../../../domain/entities/Part";
import { PartRepository } from "../../repositories/PartRepository";
import { PartReferenceAlreadyExistsError } from "@domain/errors/part/PartReferenceAlreadyExistsError";
import { PartQuantityLessThanZeroError } from "@domain/errors/part/PartQuantityLessThanZeroError";
import { PartCoastLessThanZeroError } from "@domain/errors/part/PartCoastLessThanZeroError";
import { Usecase } from "../Usecase";

export class CreatePartUsecase implements Usecase {
  public constructor(private readonly partRepository: PartRepository) {}

  public async execute(part: Part) {
    const partExists = await this.partRepository.findByReference(
      part.reference
    );

    if (part.stock < 0) {
      throw new PartQuantityLessThanZeroError();
    }

    if (part.coast < 0) {
      throw new PartCoastLessThanZeroError();
    }

    if (partExists) {
      throw new PartReferenceAlreadyExistsError();
    }
    await this.partRepository.save(part);
  }
}
