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
    public readonly totalCost: BreakdownTotalCost = BreakdownTotalCost.from(0),
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
    createdAt: Date,
    updatedAt: Date
  ) {
    const breakdownDate = BreakdownDate.from(new Date(date));
    if (breakdownDate instanceof DateBehindNowError) {
      return breakdownDate;
    }

    const totalCost2 = parts.reduce(
      (acc, part) => acc + part.part.cost.value * part.quantity,
      0
    );

    const breakdownTotalCost = BreakdownTotalCost.from(totalCost2);
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
    status: string
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
      createdAt,
      updatedAt
    );
  }
}
