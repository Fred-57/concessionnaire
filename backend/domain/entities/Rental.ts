import { randomUUID } from "crypto";
import { IntervalInMonths } from "../values/IntervalInMonths";
import { Entity } from "./Entity";
import { RentalTypeEnum } from "../types/RentalTypeEnum";

export class Rental implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly startDate: Date,
    public readonly durationInMonths: IntervalInMonths,
    public readonly type: RentalTypeEnum,
    public readonly driverIdentifier: string,
    public readonly motorcycleIdentifier: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    startDate: Date,
    durationInMonths: number,
    type: RentalTypeEnum,
    driverIdentifier: string,
    motorcycleIdentifier: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    const rentalDurationInMonths = IntervalInMonths.from(durationInMonths);

    if (rentalDurationInMonths instanceof Error) {
      return rentalDurationInMonths;
    }

    return new Rental(
      identifier,
      startDate,
      rentalDurationInMonths,
      type,
      driverIdentifier,
      motorcycleIdentifier,
      createdAt,
      updatedAt
    );
  }

  public static create(
    startDate: Date,
    durationInMonths: number,
    type: RentalTypeEnum,
    driverIdentifier: string,
    motorcycleIdentifier: string
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Rental.from(
      identifier,
      startDate,
      durationInMonths,
      type,
      driverIdentifier,
      motorcycleIdentifier,
      createdAt,
      updatedAt
    );
  }
}
