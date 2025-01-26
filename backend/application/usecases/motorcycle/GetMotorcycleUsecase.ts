import { Usecase } from "../Usecase";
import { Motorcycle } from "@domain/entities/Motorcycle";
import { MotorcycleRepository } from "@application/repositories/MotorcycleRepository";
import { MotorcycleNotFoundError } from "@domain/errors/MotorcycleNotFoundError";

export class GetMotorcycleUsecase implements Usecase<Motorcycle> {
  public constructor(
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(identifier: string) {
    const motorcycleExists =
      await this.motorcycleRepository.findByIdentifier(identifier);

    if (!motorcycleExists) {
      throw new MotorcycleNotFoundError();
    }

    return motorcycleExists;
  }
}
