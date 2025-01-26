import { Value } from "../Value";
import { GuaranteeDurationInMonthsTooShortError } from "@domain/errors/guarantee/GuaranteeDurationInMonthsTooShortError";
export class GuaranteeDurationInMonths implements Value<number> {
  private constructor(public readonly value: number) {}

  public static from(duration: number) {
    if (duration < 1) {
      return new GuaranteeDurationInMonthsTooShortError();
    }

    return new GuaranteeDurationInMonths(duration);
  }
}
