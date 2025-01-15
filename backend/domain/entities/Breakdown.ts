import { randomUUID } from "crypto";
import { Entity } from "./Entity";

export class Breakdown implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: Date,
    public readonly description: string,
    public readonly rentalIdentifier: string,
    public readonly repairIdentifier: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    date: Date,
    description: string,
    rentalIdentifier: string,
    repairIdentifier: string | null,
    createdAt: Date,
    updatedAt: Date
  ): Breakdown {
    return new Breakdown(
      identifier,
      date,
      description,
      rentalIdentifier,
      repairIdentifier,
      createdAt,
      updatedAt
    );
  }

  public static create(
    date: Date,
    description: string,
    rentalIdentifier: string,
    repairIdentifier: string | null
  ): Breakdown {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Breakdown.from(
      identifier,
      date,
      description,
      rentalIdentifier,
      repairIdentifier,
      createdAt,
      updatedAt
    );
  }
}
