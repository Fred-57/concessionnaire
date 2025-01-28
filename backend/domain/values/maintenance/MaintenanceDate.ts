import { DateBehindNowError } from "../../errors/DateBehindNowError";
import { Value } from "../Value";

export class MaintenanceDate implements Value<Date> {
  private constructor(public readonly value: Date) {}

  public static from(date: Date): MaintenanceDate {
    const currentDate = new Date();

    if (date < currentDate) {
      throw new DateBehindNowError();
    }

    return new MaintenanceDate(date);
  }
}
