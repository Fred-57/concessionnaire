import { DateBehindNowError } from "@domain/errors/DateBehindNowError";

export class BreakdownDate {
  private constructor(public readonly value: Date) {}

  public static from(date: Date): BreakdownDate {
    const currentDate = new Date();

    if (date < currentDate) {
      throw new DateBehindNowError();
    }

    return new BreakdownDate(date);
  }
}
