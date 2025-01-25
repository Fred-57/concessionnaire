import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { Guarantee } from "@domain/entities/Guarantee";
import { GuaranteeNotFoundError } from "@domain/errors/guarantee/GuaranteeNotFoundError";
import { Usecase } from "../Usecase";

export class DeleteGuaranteeUsecase implements Usecase<Guarantee> {
  public constructor(
    private readonly guaranteeRepository: GuaranteeRepository
  ) {}

  public async execute(identifier: string) {
    const guarantee =
      await this.guaranteeRepository.findByIdentifier(identifier);

    if (!guarantee) {
      throw new GuaranteeNotFoundError();
    }

    await this.guaranteeRepository.delete(guarantee);
  }
}
