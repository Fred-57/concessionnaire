import { Entity } from "./Entity";
import { randomUUID } from "crypto";

export class PartOrderHistory implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: Date,
    public readonly partIdentifier: string,
    public readonly quantity: number,
    public readonly cost: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    date: Date,
    partIdentifier: string,
    quantity: number,
    cost: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    return new PartOrderHistory(
      identifier,
      date,
      partIdentifier,
      quantity,
      cost,
      createdAt,
      updatedAt
    );
  }

  public static create(
    date: Date,
    partIdentifier: string,
    quantity: number,
    cost: number
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return PartOrderHistory.from(
      identifier,
      date,
      partIdentifier,
      quantity,
      cost,
      createdAt,
      updatedAt
    );
  }
}
