import { BrandNameTooShortError } from "@domain/errors/brand/BrandNameTooShortError";
import { Value } from "../Value";

const MIN_NAME_LENGTH = 3;

export class BrandName implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(name: string) {
    const normalizedValue = name.trim().toLowerCase();

    if (normalizedValue.length < MIN_NAME_LENGTH) {
      return new BrandNameTooShortError();
    }

    return new BrandName(normalizedValue);
  }
}
