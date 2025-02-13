import { InvalidPartOrderHistoryPartIdentifierError } from "@domain/errors/partOrderHistory/InvalidPartOrderHistoryPartIdentifierError";
import { Value } from "../Value";

export class PartOrderHistoryPartIdentifier implements Value<string> {
  private constructor(public readonly value: string) {}

  public static from(partIdentifier: string): PartOrderHistoryPartIdentifier {
    const normalizedValue = partIdentifier.trim().toLowerCase();

    if (normalizedValue === "") {
      throw new InvalidPartOrderHistoryPartIdentifierError();
    }

    return new PartOrderHistoryPartIdentifier(normalizedValue);
  }
}
