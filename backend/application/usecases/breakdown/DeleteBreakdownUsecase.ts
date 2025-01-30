import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { BreakdownNotFoundError } from "@domain/errors/breakdown/BreakdownNotFoundError";

export class DeleteBreakdownUsecase {
  public constructor(
    private readonly breakdownRepository: BreakdownRepository
  ) {}

  public async execute(identifier: string) {
    const breakdown =
      await this.breakdownRepository.findByIdentifier(identifier);

    if (!breakdown) {
      throw new BreakdownNotFoundError();
    }

    await this.breakdownRepository.delete(breakdown);
  }
}
