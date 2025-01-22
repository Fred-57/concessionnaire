import { Part } from "../../../domain/entities/Part";
import { PartRepository } from "../../repositories/PartRepository";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { Usecase } from "../Usecase";

export class CreatePartUsecase implements Usecase<Part> {
  public constructor(private readonly partRepository: PartRepository) {}

  public async execute(part: Part) {
    const partExists = await this.partRepository.findByReference(
      part.reference.value
    );

    if (!partExists) {
      throw new PartNotFoundError();
    }
    await this.partRepository.delete(part);
  }
}
