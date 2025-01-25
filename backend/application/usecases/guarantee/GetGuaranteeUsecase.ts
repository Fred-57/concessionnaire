import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { Guarantee } from "@domain/entities/Guarantee";
import { Usecase } from "../Usecase";
import { GuaranteeNotFoundError } from "@domain/errors/guarantee/GuaranteeNotFoundError";

export class GetGuaranteeUsecase implements Usecase<Guarantee> {
  public constructor(
    private readonly guaranteeRepository: GuaranteeRepository
  ) {}

  public async execute(identifier: string) {
    const guarantee =
      await this.guaranteeRepository.findByIdentifier(identifier);

    if (!guarantee) {
      throw new GuaranteeNotFoundError();
    }

    return guarantee;
  }
}
