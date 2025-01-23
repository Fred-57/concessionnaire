import { Usecase } from "../Usecase";
import { Part } from "@domain/entities/Part";
import { PartRepository } from "@application/repositories/PartRepository";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";

export class GetPartUsecase implements Usecase<Part> {
  public constructor(private readonly partRepository: PartRepository) {}

  public async execute(identifier: string) {
    const part = await this.partRepository.findByIdentifier(identifier);

    if (!part) {
      throw new PartNotFoundError();
    }

    return part;
  }
}
