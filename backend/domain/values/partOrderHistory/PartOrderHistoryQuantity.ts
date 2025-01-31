import { InvalidQuantityError } from "../../errors/InvalidQuantityError";
import { Value } from "../Value";

export class PartOrderHistoryQuantity implements Value<number> {
  private constructor(public readonly value: number) {}

  public static from(quantity: number): PartOrderHistoryQuantity {
    if (quantity < 1) {
      throw new InvalidQuantityError();
    }
    return new PartOrderHistoryQuantity(quantity);
  }
}
