import { randomUUID } from "crypto";
import { Entity } from "./Entity";
import { Part } from "./Part";
import { GuaranteeName } from "@domain/values/guarantee/GuaranteeName";
import { GuaranteeDurationInMonths } from "@domain/values/guarantee/GuaranteeDurationInMonths";
import { GuaranteeCoveredAmount } from "@domain/values/guarantee/GuaranteeCoveredAmount";
import { Motorcycle } from "./Motorcycle";

export class Guarantee implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: GuaranteeName,
    public readonly durationInMonths: GuaranteeDurationInMonths,
    public readonly coveredAmount: GuaranteeCoveredAmount,
    public readonly parts: Part[],
    public readonly motorcycles: Motorcycle[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    nameValue: string,
    durationInMonthsValue: number,
    coveredAmountValue: number,
    parts: Part[],
    motorcycles: Motorcycle[],
    createdAt: Date,
    updatedAt: Date
  ) {
    const name = GuaranteeName.from(nameValue);

    if (name instanceof Error) {
      throw name;
    }

    const durationInMonths = GuaranteeDurationInMonths.from(
      durationInMonthsValue
    );

    if (durationInMonths instanceof Error) {
      throw durationInMonths;
    }

    const coveredAmount = GuaranteeCoveredAmount.from(coveredAmountValue);

    if (coveredAmount instanceof Error) {
      throw coveredAmount;
    }

    return new Guarantee(
      identifier,
      name,
      durationInMonths,
      coveredAmount,
      parts,
      motorcycles,
      createdAt,
      updatedAt
    );
  }

  public static create(
    name: string,
    durationInMonths: number,
    coveredAmount: number,
    parts: Part[],
    motorcycles: Motorcycle[]
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Guarantee.from(
      identifier,
      name,
      durationInMonths,
      coveredAmount,
      parts,
      motorcycles,
      createdAt,
      updatedAt
    );
  }
}
