import { Entity } from "./Entity";
import { Part } from "./Part";
import { StatusRepair } from "../types/StatusRepair";
import { randomUUID } from "crypto";

export class Repair implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly date: Date,
    public readonly replacedParts: Part[],
    public readonly cost: number,
    public readonly status: StatusRepair = "PENDING",
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    date: Date,
    replacedParts: Part[],
    cost: number,
    status: StatusRepair,
    createdAt: Date,
    updatedAt: Date
  ): Repair {
    return new Repair(
      identifier,
      date,
      replacedParts,
      cost,
      status,
      createdAt,
      updatedAt
    );
  }

  public static create(
    date: Date,
    replacedParts: Part[],
    cost: number
  ): Repair {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Repair.from(
      identifier,
      date,
      replacedParts,
      cost,
      "PENDING",
      createdAt,
      updatedAt
    );
  }
}
