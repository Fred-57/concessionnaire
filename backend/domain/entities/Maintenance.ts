import { Entity } from "./Entity";
import { StatusMaintenanceBreakdownEnum } from "../types/StatusMaintenanceBreakdownEnum";
import { randomUUID } from "crypto";
import { MaintenancePartType } from "@domain/types/MaintenancePartType";

export class Maintenance implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: Date,
    public readonly recommendation: string,
    public readonly status: StatusMaintenanceBreakdownEnum = StatusMaintenanceBreakdownEnum.PENDING,
    public readonly totalCost: number = 0,
    public readonly motorcycleIdentifier: string,
    public readonly parts: MaintenancePartType[],
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
    parts: MaintenancePartType[],
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
    parts: MaintenancePartType[]
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    const totalCost = parts.reduce(
      (acc, part) => acc + part.part.cost.value * part.quantity,
      0
    );

    return Maintenance.from(
      identifier,
      date,
      recommendation,
      StatusMaintenanceBreakdownEnum.PENDING,
      totalCost,
      motorcycleIdentifier,
      parts.map((part) => ({
        part: part.part,
        quantity: part.quantity,
      })),
      createdAt,
      updatedAt
    );
  }

  public static update(
    maintenance: Maintenance,
    date: Date,
    recommendation: string,
    motorcycleIdentifier: string,
    parts: MaintenancePartType[]
  ) {
    const totalCost = parts.reduce(
      (acc, part) => acc + part.part.cost.value * part.quantity,
      0
    );

    return Maintenance.from(
      maintenance.identifier,
      date,
      recommendation,
      maintenance.status,
      totalCost,
      motorcycleIdentifier,
      parts,
      maintenance.createdAt,
      new Date()
    );
  }
}
