import { MaintenanceTotalCostLessThanZeroError } from "@domain/errors/maintenance/MaintenanceTotalCostLessThanZeroError";
import { Value } from "../Value";

export class MaintenanceTotalCost implements Value<Number> {
  private constructor(public readonly value: number) {}

  public static from(cost: string) {
    const normalizedValue = parseInt(cost);

    if (normalizedValue < 0) {
      return new MaintenanceTotalCostLessThanZeroError();
    }

    return new MaintenanceTotalCost(normalizedValue);
  }
}
