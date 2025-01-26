import { Usecase } from "../Usecase";
import { Motorcycle } from "@domain/entities/Motorcycle";
import { MotorcycleRepository } from "@application/repositories/MotorcycleRepository";

export class ListMotorcyclesUsecase implements Usecase<Motorcycle[]> {
  public constructor(
    private readonly motorcycleRepository: MotorcycleRepository
  ) {}

  public async execute(companyIdentifier: string) {
    return this.motorcycleRepository.findManyByCompanyIdentifier(
      companyIdentifier
    );
  }
}
