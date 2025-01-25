import { Usecase } from "../Usecase";
import { Guarantee } from "@domain/entities/Guarantee";
import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { GuaranteeNameAlreadyTakenError } from "@domain/errors/guarantee/GuaranteeNameAlreadyTakenError";
import { IntervalInMonths } from "@domain/values/IntervalInMonths";
import { InvalidIntervalInMonthsError } from "@domain/errors/InvalidIntervalInMonthsError";

export class CreateGuaranteeUsecase implements Usecase<Guarantee> {
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

    const durationInMonths = IntervalInMonths.from(
      guarantee.durationInMonths.value
    );

    if (durationInMonths instanceof InvalidIntervalInMonthsError) {
      throw durationInMonths;
    }

    await this.guaranteeRepository.save(guarantee);
  }
}
