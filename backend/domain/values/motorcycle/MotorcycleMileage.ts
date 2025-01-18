import { MotorcycleNegativeMileage } from "@domain/errors/motorcycle/MotorcycleNegativeMileage";
import { Value } from "../Value";

const MIN_MILEAGE = 0;

export class MotorcycleMileage implements Value<number> {
  private constructor(public readonly value: number) {}

  public static from(mileage: number): MotorcycleMileage {
    if (mileage < MIN_MILEAGE) {
      throw new MotorcycleNegativeMileage();
    }

    return new MotorcycleMileage(mileage);
  }
}
