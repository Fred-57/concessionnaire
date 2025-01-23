import { Part } from "../../../domain/entities/Part";
import { PartRepository } from "../../repositories/PartRepository";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { Usecase } from "../Usecase";

export class DeletePartUsecase implements Usecase<Part> {
  public constructor(private readonly partRepository: PartRepository) {}

  public async execute(identifier: string) {
    const partExists = await this.partRepository.findByIdentifier(identifier);

    if (!partExists) {
      throw new PartNotFoundError();
    }
    await this.partRepository.delete(partExists);
  }
}
