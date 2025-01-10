import { License } from "../types/License";
import { Entity } from "./Entity";

export class Driver implements Entity {
  private constructor(
    public readonly identifier: number,
    public readonly name: string,
    public readonly license: License,
    public readonly numberOfYearsOfExperience: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static from(
    identifier: number,
    name: string,
    license: License,
    numberOfYearsOfExperience: number,
    createdAt: Date,
    updatedAt: Date,
  ): Driver {
    return new Driver(
      identifier,
      name,
      license,
      numberOfYearsOfExperience,
      createdAt,
      updatedAt,
    );
  }
}
