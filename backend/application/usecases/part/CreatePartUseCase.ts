import { Part } from "../../../domain/entities/Part";
import { PartRepository } from "../../repositories/PartRepository";
import { PartReferenceAlreadyExistsError } from "@domain/errors/part/PartReferenceAlreadyExistsError";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { PartNameTooShortError } from "@domain/errors/part/PartNameTooShortError";
import { PartReferenceTooShortError } from "@domain/errors/part/PartReferenceTooShortError";

import { Usecase } from "../Usecase";

export class CreatePartUsecase implements Usecase<Part> {
  public constructor(private readonly partRepository: PartRepository) {}

  public async execute(part: Part) {
    const partExists = await this.partRepository.findByReference(
      part.reference.value
    );

    if (partExists) {
      throw new PartReferenceAlreadyExistsError();
    }
    await this.partRepository.save(part);
  }
}
