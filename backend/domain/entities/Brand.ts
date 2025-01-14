import { randomUUID } from "crypto";
import { BrandName } from "@domain/values/brand/BrandName";
import { Entity } from "./Entity";

export class Brand implements Entity {
  private constructor(
    public readonly identifier: string,
    public readonly name: BrandName,
    public readonly logo: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    nameValue: string,
    logo: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    const name = BrandName.from(nameValue);

    if (name instanceof Error) {
      return name;
    }

    return new Brand(identifier, name, logo, createdAt, updatedAt);
  }

  public static create(name: string, logo: string) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Brand.from(identifier, name, logo, createdAt, updatedAt);
  }
}
