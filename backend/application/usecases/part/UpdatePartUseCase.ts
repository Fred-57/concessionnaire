import { Part } from "../../../domain/entities/Part";
import { PartRepository } from "../../repositories/PartRepository";
import { PartReferenceAlreadyExistsError } from "@domain/errors/part/PartReferenceAlreadyExistsError";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { Usecase } from "../Usecase";

export class UpdatePartUsecase implements Usecase<Part> {
  public constructor(private readonly partRepository: PartRepository) {}

  public async execute(part: Part) {
    const partExists = await this.partRepository.findByIdentifier(
      part.identifier
    );
    if (!partExists) {
      throw new PartNotFoundError();
    }

    if (partExists.identifier !== part.identifier) {
      throw new PartReferenceAlreadyExistsError();
    }

    await this.partRepository.update(part);
  }
}
