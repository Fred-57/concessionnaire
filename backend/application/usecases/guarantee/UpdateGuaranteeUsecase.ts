import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { Guarantee } from "@domain/entities/Guarantee";
import { GuaranteeNotFoundError } from "@domain/errors/guarantee/GuaranteeNotFoundError";
import { GuaranteeNameAlreadyTakenError } from "@domain/errors/guarantee/GuaranteeNameAlreadyTakenError";
import { Usecase } from "../Usecase";
import { PartRepository } from "@application/repositories/PartRepository";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";

export class UpdateGuaranteeUsecase implements Usecase<Guarantee> {
  public constructor(
    private readonly guaranteeRepository: GuaranteeRepository,
    private readonly partRepository: PartRepository
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
    for (const partIdentifier of guarantee.partsIdentifiers) {
      const partExists =
        await this.partRepository.findByIdentifier(partIdentifier);
      if (!partExists) {
        throw new PartNotFoundError();
      }
    }
    // for (const motorcycleIdentifier of guarantee.motorcyclesIdentifiers) {
    //   const motorcycleExists =
    //     await this.motorcycleRepository.findByIdentifier(motorcycleIdentifier);
    //   if (!motorcycleExists) {
    //     throw new MotorcycleNotFoundError();
    //   }
    // }
    await this.guaranteeRepository.update(guarantee);
  }
}
