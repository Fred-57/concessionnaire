import { Usecase } from "../Usecase";
import { Guarantee } from "@domain/entities/Guarantee";
import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { GuaranteeNameAlreadyTakenError } from "@domain/errors/guarantee/GuaranteeNameAlreadyTakenError";
import { IntervalInMonths } from "@domain/values/IntervalInMonths";
import { InvalidIntervalInMonthsError } from "@domain/errors/InvalidIntervalInMonthsError";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { PartRepository } from "@application/repositories/PartRepository";

export class CreateGuaranteeUsecase implements Usecase<Guarantee> {
  public constructor(
    private readonly guaranteeRepository: GuaranteeRepository,
    private readonly partRepository: PartRepository
  ) {}

  public async execute(guarantee: Guarantee) {
    const nameExists = await this.guaranteeRepository.findByName(
      guarantee.name.value
    );

    if (nameExists) {
      throw new GuaranteeNameAlreadyTakenError();
    }

    const durationInMonths = IntervalInMonths.from(
      guarantee.durationInMonths.value
    );

    if (durationInMonths instanceof InvalidIntervalInMonthsError) {
      throw durationInMonths;
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

    await this.guaranteeRepository.save(guarantee);
  }
}
