import { InvalidQuantityError } from "../../errors/InvalidQuantityError";
import { Value } from "../Value";

export class PartOrderHistoryQuantity implements Value<number> {
  private constructor(public readonly value: number) {}

  public static from(quantity: string): PartOrderHistoryQuantity {
    const normalizedValue = parseInt(quantity);

    if (normalizedValue < 3) {
      throw new InvalidQuantityError();
    }

    return new PartOrderHistoryQuantity(normalizedValue);
  }
}
