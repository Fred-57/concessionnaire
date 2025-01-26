import { Usecase } from "../Usecase";
import { Motorcycle } from "@domain/entities/Motorcycle";
import { MotorcycleRepository } from "@application/repositories/MotorcycleRepository";
import { MotorcycleNotFoundError } from "@domain/errors/MotorcycleNotFoundError";

export class GetMotorcycleUsecase implements Usecase<Motorcycle> {
  public constructor(
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(motorcycle: Motorcycle) {
    const motorcycleExists = await this.motorcycleRepository.findByIdentifier(
      motorcycle.identifier
    );

    if (!motorcycleExists) {
      throw new MotorcycleNotFoundError();
    }

    return motorcycleExists;
  }
}
