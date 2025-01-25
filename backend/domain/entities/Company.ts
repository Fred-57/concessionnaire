import { randomUUID } from "crypto";
import { CompanyName } from "@domain/values/company/CompanyName";
import { Entity } from "./Entity";
import { CompanyTypeEnum } from "@domain/types/CompanyTypeEnum";

export class Company implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: CompanyName,
    public readonly type: CompanyTypeEnum,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    nameValue: string,
    type: CompanyTypeEnum,
    createdAt: Date,
    updatedAt: Date
  ) {
    const name = CompanyName.from(nameValue);

    if (name instanceof Error) {
      return name;
    }

    return new Company(identifier, name, type, createdAt, updatedAt);
  }

  public static create(name: string, type: CompanyTypeEnum) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Company.from(identifier, name, type, createdAt, updatedAt);
  }
}
