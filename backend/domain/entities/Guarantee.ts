import { randomUUID } from "crypto";
import { Entity } from "./Entity";
import { Part } from "./Part";
import { GuaranteeName } from "@domain/values/guarantee/GuaranteeName";
import { GuaranteeDurationInMonths } from "@domain/values/guarantee/GuaranteeDurationInMonths";
import { GuaranteeCoveredAmount } from "@domain/values/guarantee/GuaranteeCoveredAmount";

export class Guarantee implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: GuaranteeName,
    public readonly durationInMonths: number,
    public readonly coveredAmount: GuaranteeCoveredAmount,
    public readonly parts: Part[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    nameValue: string,
    durationInMonths: number,
    coveredAmountValue: number,
    parts: Part[],
    createdAt: Date,
    updatedAt: Date
  ) {
    const name = GuaranteeName.from(nameValue);

    if (name instanceof Error) {
      return name;
    }

    const duration = GuaranteeDurationInMonths.from(durationInMonths);

    if (duration instanceof Error) {
      return duration;
    }

    const coveredAmount = GuaranteeCoveredAmount.from(coveredAmountValue);

    if (coveredAmount instanceof Error) {
      return coveredAmount;
    }

    return new Guarantee(
      identifier,
      name,
      durationInMonths,
      coveredAmount,
      parts,
      createdAt,
      updatedAt
    );
  }

  public static create(
    name: string,
    durationInMonths: number,
    coveredAmount: number,
    parts: Part[]
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
      createdAt,
      updatedAt
    );
  }
}
