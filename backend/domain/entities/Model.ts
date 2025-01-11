import { randomUUID } from "crypto";
import { ModelName } from "@domain/values/model/ModelName";
import { Entity } from "./Entity";

export class Model implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: ModelName,
    public readonly repairMileage: number,
    public readonly repairDeadline: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    nameValue: string,
    repairMileage: number,
    repairDeadline: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    const name = ModelName.from(nameValue);

    if (name instanceof Error) {
      return name;
    }

    return new Model(
      identifier,
      name,
      repairMileage,
      repairDeadline,
      createdAt,
      updatedAt
    );
  }

  public static create(
    name: string,
    repairMileage: number,
    repairDeadline: number
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Model.from(
      identifier,
      name,
      repairMileage,
      repairDeadline,
      createdAt,
      updatedAt
    );
  }
}
