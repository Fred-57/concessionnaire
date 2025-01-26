import { randomUUID } from "crypto";
import { License } from "../types/License";
import { DriverName } from "../values/driver/DriverName";
import { Entity } from "./Entity";
import { DriverNameTooShortError } from "@domain/errors/driver/DriverNameTooShortError";

export class Driver implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: DriverName,
    public readonly license: License,
    public readonly numberOfYearsOfExperience: number,
    public readonly companyIdentifier: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    name: string,
    license: License,
    numberOfYearsOfExperience: number,
    companyIdentifier: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    const driverName = DriverName.from(name);

    if (driverName instanceof DriverNameTooShortError) {
      return driverName;
    }

    return new Driver(
      identifier,
      driverName,
      license,
      numberOfYearsOfExperience,
      companyIdentifier,
      createdAt,
      updatedAt
    );
  }

  public static create(
    name: string,
    license: License,
    numberOfYearsOfExperience: number,
    companyIdentifier: string
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Driver.from(
      identifier,
      name,
      license,
      numberOfYearsOfExperience,
      companyIdentifier,
      createdAt,
      updatedAt
    );
  }
}
