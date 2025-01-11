import { InvalidIntervalInMonthsError } from "../errors/InvalidIntervalInMonthsError";
import { Value } from "./Value";

export class IntervalInMonths implements Value<number> {
  private constructor(public readonly value: number) {}

  public static from(months: number): IntervalInMonths {
    if (months < 1) {
      throw new InvalidIntervalInMonthsError();
    }

    return new IntervalInMonths(months);
  }
}
