import { randomUUID } from "crypto";
import { Entity } from "./Entity";
import { StatusMaintenanceBreakdownEnum } from "@domain/types/StatusMaintenanceBreakdownEnum";
import { BreakdownDate } from "@domain/values/breakdown/BreakdownDate";
import { DateBehindNowError } from "@domain/errors/DateBehindNowError";
import { BreakdownTotalCost } from "@domain/values/breakdown/BreakdownTotalCost";
import { BreakdownTotalCostLessThanZeroError } from "@domain/errors/breakdown/BreakdownTotalCostLessThanZero";
import { BreakdownPartType } from "@domain/types/BreakdownPartType";

export class Breakdown implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: BreakdownDate,
    public readonly description: string,
    public readonly rentalIdentifier: string,
    public readonly parts: BreakdownPartType[],
    public readonly status: StatusMaintenanceBreakdownEnum,
    public readonly totalCost: BreakdownTotalCost,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    date: Date,
    description: string,
    rentalIdentifier: string,
    parts: BreakdownPartType[],
    status: string,
    totalCost: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    const breakdownDate = BreakdownDate.from(new Date(date));
    if (breakdownDate instanceof DateBehindNowError) {
      return breakdownDate;
    }

    const breakdownTotalCost = BreakdownTotalCost.from(totalCost);
    if (breakdownTotalCost instanceof BreakdownTotalCostLessThanZeroError) {
      return breakdownTotalCost;
    }

    return new Breakdown(
      identifier,
      breakdownDate,
      description,
      rentalIdentifier,
      parts,
      status as StatusMaintenanceBreakdownEnum,
      breakdownTotalCost,
      createdAt,
      updatedAt
    );
  }

  public static create(
    date: Date,
    description: string,
    rentalIdentifier: string,
    parts: BreakdownPartType[],
    status: string,
    totalCost: number = 0
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Breakdown.from(
      identifier,
      date,
      description,
      rentalIdentifier,
      parts,
      status,
      totalCost,
      createdAt,
      updatedAt
    );
  }
}
