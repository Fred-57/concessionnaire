import { InvalidPartOrderHistoryDateError } from "../../errors/partOrderHistory/InvalidPartOrderHistoryDateError";
import { Value } from "../Value";

export class PartOrderHistoryDate implements Value<Date> {
  private constructor(public readonly value: Date) {}

  public static from(date: Date): PartOrderHistoryDate {
    const currentDate = new Date();

    if (date > currentDate) {
      throw new InvalidPartOrderHistoryDateError();
    }

    return new PartOrderHistoryDate(date);
  }
}
