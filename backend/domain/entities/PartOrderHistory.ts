import { PartOrderHistoryStatusEnum } from "@domain/types/PartOrderHistoryStatusEnum";
import { Entity } from "./Entity";
import { randomUUID } from "crypto";
import { PartOrderHistoryDate } from "@domain/values/partOrderHistory/PartOrderHistoryDate";
import { PartOrderHistoryPartIdentifier } from "@domain/values/partOrderHistory/PartOrderHistoryPartIdentifier";
import { PartOrderHistoryQuantity } from "@domain/values/partOrderHistory/PartOrderHistoryQuantity";

export class PartOrderHistory implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: PartOrderHistoryDate,
    public readonly quantity: PartOrderHistoryQuantity,
    public readonly cost: number,
    public readonly status: PartOrderHistoryStatusEnum,
    public readonly partIdentifier: PartOrderHistoryPartIdentifier,
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
    const partOrderHistoryDate = PartOrderHistoryDate.from(date);
    if (partOrderHistoryDate instanceof Error) {
      return partOrderHistoryDate;
    }

    const partOrderHistoryPartIdentifier =
      PartOrderHistoryPartIdentifier.from(partIdentifier);
    if (partOrderHistoryPartIdentifier instanceof Error) {
      return partOrderHistoryPartIdentifier;
    }

    const partOrderHistoryQuantity = PartOrderHistoryQuantity.from(quantity);
    if (partOrderHistoryQuantity instanceof Error) {
      return partOrderHistoryQuantity;
    }

    return new PartOrderHistory(
      identifier,
      partOrderHistoryDate,
      partOrderHistoryQuantity,
      cost,
      status,
      partOrderHistoryPartIdentifier,
      createdAt,
      updatedAt
    );
  }

  public static create(
    date: Date,
    partIdentifier: string,
    quantity: number,
    cost: number = 0
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
