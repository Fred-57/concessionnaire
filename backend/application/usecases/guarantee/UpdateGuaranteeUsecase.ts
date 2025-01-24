import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { Guarantee } from "@domain/entities/Guarantee";
import { GuaranteeNotFoundError } from "@domain/errors/guarantee/GuaranteeNotFoundError";
import { GuaranteeNameAlreadyTakenError } from "@domain/errors/guarantee/GuaranteeNameAlreadyTakenError";
import { Usecase } from "../Usecase";

export class UpdateGuaranteeUsecase implements Usecase<Guarantee> {
  public constructor(
    private readonly guaranteeRepository: GuaranteeRepository
  ) {}

  public async execute(guarantee: Guarantee) {
    const guaranteeExists = await this.guaranteeRepository.findByIdentifier(
      guarantee.identifier
    );

    if (!guaranteeExists) {
      throw new GuaranteeNotFoundError();
    }

    const nameExists = await this.guaranteeRepository.findByName(
      guarantee.name.value
    );

    if (nameExists && nameExists.identifier !== guarantee.identifier) {
      throw new GuaranteeNameAlreadyTakenError();
    }

    await this.guaranteeRepository.update(guarantee);
  }
}
