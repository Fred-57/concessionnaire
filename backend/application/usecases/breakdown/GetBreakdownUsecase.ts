import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { Breakdown } from "@domain/entities/Breakdown";
import { BreakdownNotFoundError } from "@domain/errors/breakdown/BreakdownNotFoundError";

export class GetBreakdownUsecase {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository
  ) {}

  public async execute(identifier: string) {
    const breakdown =
      await this.breakdownRepository.findByIdentifier(identifier);

    if (!breakdown) {
      throw new BreakdownNotFoundError();
    }

    return breakdown;
  }
}
