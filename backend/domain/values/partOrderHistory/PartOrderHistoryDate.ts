import { Value } from "../Value";
import { DateBehindNowError } from "@domain/errors/DateBehindNowError";

export class PartOrderHistoryDate implements Value<Date> {
  private constructor(public readonly value: Date) {}

  public static from(date: Date): PartOrderHistoryDate {
    const currentDate = new Date();
    const currentDateWithoutTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (date < currentDateWithoutTime) {
      throw new DateBehindNowError();
    }

    return new PartOrderHistoryDate(date);
  }
}
