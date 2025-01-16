import { CostLessThanZeroError } from "../errors/CostLessThanZeroError";
import { Value } from "./Value";

export class Cost implements Value<Number> {
  private constructor(public readonly value: Number) {}

  public static from(cost: string): Cost {
    const normalizedValue = parseInt(cost);
    if (normalizedValue < 0) {
      throw new CostLessThanZeroError();
    }

    return new Cost(normalizedValue);
  }
}
