import { randomUUID } from "crypto";
import { Entity } from "./Entity";
import { Part } from "./Part";
import { GuaranteeName } from "@domain/values/guarantee/GuaranteeName";

export class Guarantee implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: GuaranteeName,
    public readonly parts: Part[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    nameValue: string,
    parts: Part[],
    createdAt: Date,
    updatedAt: Date
  ) {
    const name = GuaranteeName.from(nameValue);

    if (name instanceof Error) {
      return name;
    }

    return new Guarantee(identifier, name, parts, createdAt, updatedAt);
  }

  public static create(name: string, parts: Part[]) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Guarantee.from(identifier, name, parts, createdAt, updatedAt);
  }
}
