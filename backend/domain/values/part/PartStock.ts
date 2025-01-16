import { InvalidQuantityError } from "@domain/errors/InvalidQuantityError";
import { Value } from "../Value";

export class PartStock implements Value<Number> {
  private constructor(public readonly value: number) {}

  public static from(stock: string): PartStock {
    const normalizedValue = parseInt(stock);

    if (normalizedValue < 0) {
      throw new InvalidQuantityError();
    }

    return new PartStock(normalizedValue);
  }
}
