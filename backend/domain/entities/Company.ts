import { randomUUID } from "crypto";
import { CompanyName } from "@domain/values/company/CompanyName";
import { Entity } from "./Entity";

export class Company implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: CompanyName,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    nameValue: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    const name = CompanyName.from(nameValue);

    if (name instanceof Error) {
      return name;
    }

    return new Company(identifier, name, createdAt, updatedAt);
  }

  public static create(name: string) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Company.from(identifier, name, createdAt, updatedAt);
  }
}
