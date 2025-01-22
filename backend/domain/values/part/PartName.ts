import { PartNameTooShortError } from "@domain/errors/part/PartNameTooShortError";
import { Value } from "../Value";

const MIN_NAME_LENGTH = 1;

export class PartName implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(name: string) {
    const normalizedValue = name.trim().toLowerCase();

    if (normalizedValue.length < MIN_NAME_LENGTH) {
      return new PartNameTooShortError();
    }

    return new PartName(normalizedValue);
  }
}
