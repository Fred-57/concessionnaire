import { PartReferenceTooShortError } from "@domain/errors/part/PartReferenceTooShortError";
import { Value } from "../Value";

const MIN_NAME_LENGTH = 1;

export class PartReference implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(reference: string) {
    const normalizedValue = reference.trim().toLowerCase();
    if (normalizedValue.length < MIN_NAME_LENGTH) {
      return new PartReferenceTooShortError();
    }

    return new PartReference(normalizedValue);
  }
}
