import { Value } from "../Value";
import { MotorcycleStatusEnum } from "@domain/types/MotorcycleStatusEnum";
import { MotorcycleIncorrectStatus } from "@domain/errors/motorcycle/MotorcycleIncorrectStatus";

export class MotorcycleStatus implements Value<MotorcycleStatusEnum> {
  private constructor(public readonly value: MotorcycleStatusEnum) {}

  public static from(status: string): MotorcycleStatus {
    if (
      !Object.values(MotorcycleStatusEnum).includes(
        status as MotorcycleStatusEnum
      )
    ) {
      throw new MotorcycleIncorrectStatus();
    }

    return new MotorcycleStatus(status as MotorcycleStatusEnum);
  }
}
