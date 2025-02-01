import { BreakdownTotalCostLessThanZeroError } from "@domain/errors/breakdown/BreakdownTotalCostLessThanZero";

export class BreakdownTotalCost {
  private constructor(public readonly value: number) {}

  public static from(totalCost: number): BreakdownTotalCost {
    if (totalCost < 0) {
      throw new BreakdownTotalCostLessThanZeroError();
    }
    return new BreakdownTotalCost(totalCost);
  }
}
