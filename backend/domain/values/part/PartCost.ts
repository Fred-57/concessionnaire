import { Value } from "../Value";
import { CostLessThanZeroError } from "@domain/errors/CostLessThanZeroError";

export class PartCost implements Value<Number> {
  private constructor(public readonly value: number) {}

  public static from(cost: string) {
    const normalizedValue = parseInt(cost);

    if (normalizedValue < 0) {
      return new CostLessThanZeroError();
    }

    return new PartCost(normalizedValue);
  }
}
