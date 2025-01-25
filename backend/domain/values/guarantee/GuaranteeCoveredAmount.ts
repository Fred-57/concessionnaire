import { Value } from "../Value";
import { GuaranteeCoveredAmountTooLowError } from "@domain/errors/guarantee/GuaranteeCoveredAmountTooLowError";
export class GuaranteeCoveredAmount implements Value<number> {
  private constructor(public readonly value: number) {}

  public static from(coveredAmount: number) {
    if (coveredAmount < 1) {
      return new GuaranteeCoveredAmountTooLowError();
    }

    return new GuaranteeCoveredAmount(coveredAmount);
  }
}
