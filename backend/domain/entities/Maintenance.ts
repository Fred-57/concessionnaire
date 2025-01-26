import { Entity } from "./Entity";
import { StatusMaintenanceBreakdownEnum } from "../types/StatusMaintenanceBreakdownEnum";
import { randomUUID } from "crypto";
import { Part } from "./Part";

export class Maintenance implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: Date,
    public readonly recommendation: string,
    public readonly status: StatusMaintenanceBreakdownEnum = StatusMaintenanceBreakdownEnum.PENDING,
    public readonly totalCost: number = 0,
    public readonly motorcycleIdentifier: string,
    public readonly parts: Part[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    date: Date,
    recommendation: string,
    status: StatusMaintenanceBreakdownEnum,
    totalCost: number,
    motorcycleIdentifier: string,
    parts: Part[],
    createdAt: Date,
    updatedAt: Date
  ) {
    return new Maintenance(
      identifier,
      date,
      recommendation,
      status,
      totalCost,
      motorcycleIdentifier,
      parts,
      createdAt,
      updatedAt
    );
  }

  public static create(
    date: Date,
    recommendation: string,
    motorcycleIdentifier: string,
    parts: Part[]
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    const totalCost = parts.reduce((acc, part) => acc + part.cost.value, 0);

    return Maintenance.from(
      identifier,
      date,
      recommendation,
      StatusMaintenanceBreakdownEnum.PENDING,
      totalCost,
      motorcycleIdentifier,
      parts,
      createdAt,
      updatedAt
    );
  }
}
