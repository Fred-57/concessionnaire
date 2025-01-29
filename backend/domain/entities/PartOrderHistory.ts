import { PartOrderHistoryStatusEnum } from "@domain/types/PartOrderHistoryStatusEnum";
import { Entity } from "./Entity";
import { randomUUID } from "crypto";

export class PartOrderHistory implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: Date,
    public readonly quantity: number,
    public readonly cost: number,
    public readonly status: PartOrderHistoryStatusEnum,
    public readonly partIdentifier: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    date: Date,
    quantity: number,
    cost: number,
    status: PartOrderHistoryStatusEnum,
    partIdentifier: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    return new PartOrderHistory(
      identifier,
      date,
      quantity,
      cost,
      status,
      partIdentifier,
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
      quantity,
      cost,
      PartOrderHistoryStatusEnum.PENDING,
      partIdentifier,
      createdAt,
      updatedAt
    );
  }
}
