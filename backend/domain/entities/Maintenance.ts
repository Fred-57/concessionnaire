import { Entity } from "./Entity";
import { StatusMaintenanceBreakdownEnum } from "../types/StatusMaintenanceBreakdownEnum";
import { randomUUID } from "crypto";

export class Maintenance implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: Date,
    public readonly motorcycleIdentifier: string,
    public readonly recommendation: string,
    public readonly status: StatusMaintenanceBreakdownEnum = StatusMaintenanceBreakdownEnum.PENDING,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    date: Date,
    motorcycleIdentifier: string,
    recommendation: string,
    status: StatusMaintenanceBreakdownEnum,
    createdAt: Date,
    updatedAt: Date
  ) {
    return new Maintenance(
      identifier,
      date,
      motorcycleIdentifier,
      recommendation,
      status,
      createdAt,
      updatedAt
    );
  }

  public static create(
    date: Date,
    motorcycleIdentifier: string,
    recommendation: string
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Maintenance.from(
      identifier,
      date,
      motorcycleIdentifier,
      recommendation,
      StatusMaintenanceBreakdownEnum.PENDING,
      createdAt,
      updatedAt
    );
  }
}
