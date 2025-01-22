import { Usecase } from "../Usecase";
import { Part } from "@domain/entities/Part";
import { PartRepository } from "@application/repositories/PartRepository";

export class ListPartsUsecase implements Usecase<Part[]> {
  public constructor(private readonly partRepsitory: PartRepository) {}

  public async execute() {
    const parts = await this.partRepsitory.findAll();
    return parts;
  }
}
