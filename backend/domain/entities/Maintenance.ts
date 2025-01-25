import { Entity } from "./Entity";
import { StatusMaintenance } from "../types/StatusMaintenance";
import { randomUUID } from "crypto";

export class Maintenance implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: Date,
    public readonly motorcycleIdentifier: string,
    public readonly recommendation: string,
    public readonly status: StatusMaintenance = "PENDING",
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    date: Date,
    motorcycleIdentifier: string,
    recommendation: string,
    status: StatusMaintenance,
    createdAt: Date,
    updatedAt: Date
  ): Maintenance {
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
  ): Maintenance {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Maintenance.from(
      identifier,
      date,
      motorcycleIdentifier,
      recommendation,
      "PENDING",
      createdAt,
      updatedAt
    );
  }
}
