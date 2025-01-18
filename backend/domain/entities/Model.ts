import { randomUUID } from "crypto";
import { ModelName } from "@domain/values/model/ModelName";
import { Entity } from "./Entity";
import { IntervalInMonths } from "@domain/values/IntervalInMonths";

export class Model implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: ModelName,
    public readonly repairMileage: number,
    public readonly repairDeadline: IntervalInMonths,
    public readonly brandIdentifier: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    nameValue: string,
    repairMileage: number,
    repairDeadline: number,
    brandIdentifier: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    const name = ModelName.from(nameValue);

    if (name instanceof Error) {
      return name;
    }

    const deadlineInMonths = IntervalInMonths.from(repairDeadline);

    if (deadlineInMonths instanceof Error) {
      return deadlineInMonths;
    }

    return new Model(
      identifier,
      name,
      repairMileage,
      deadlineInMonths,
      brandIdentifier,
      createdAt,
      updatedAt
    );
  }

  public static create(
    name: string,
    repairMileage: number,
    repairDeadline: number,
    brandIdentifier: string
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Model.from(
      identifier,
      name,
      repairMileage,
      repairDeadline,
      brandIdentifier,
      createdAt,
      updatedAt
    );
  }
}
