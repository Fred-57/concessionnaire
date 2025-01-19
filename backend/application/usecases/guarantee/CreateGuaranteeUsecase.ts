import { Usecase } from "../Usecase";
import { Guarantee } from "@domain/entities/Guarantee";
import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { GuaranteeNameAlreadyTakenError } from "@domain/errors/guarantee/GuaranteeNameAlreadyTakenError";

export class CreateGuaranteeUsecase implements Usecase {
  public constructor(
    private readonly guaranteeRepository: GuaranteeRepository
  ) {}

  public async execute(guarantee: Guarantee) {
    const nameExists = await this.guaranteeRepository.findByName(
      guarantee.name.value
    );

    if (nameExists) {
      throw new GuaranteeNameAlreadyTakenError();
    }

    await this.guaranteeRepository.save(guarantee);
  }
}
