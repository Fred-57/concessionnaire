import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { RentalRepository } from "@application/repositories/RentalRepository";
import { RentalNotFoundError } from "@domain/errors/rental/RentalNotFoundError";

export class ListBreakdownsUseCase {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository
  ) {}

  public async execute() {
    return this.breakdownRepository.findAll();
  }
}
