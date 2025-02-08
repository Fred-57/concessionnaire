import { Entity } from "./Entity";
import { randomUUID } from "crypto";
import { PartReference } from "@domain/values/part/PartReference";
import { PartName } from "@domain/values/part/PartName";
import { PartCost } from "@domain/values/part/PartCost";
import { PartStock } from "@domain/values/part/PartStock";

export class Part implements Entity {
  private constructor(
    /**
     * @description Identifiant
     */
    public readonly identifier: string,

    /**
     * @description reference
     */
    public readonly reference: PartReference,

    /**
     * @description Désignation
     */
    public readonly name: PartName,
    /**
     * @description Prix
     */
    public readonly cost: PartCost,

    /**
     * @description Stock
     */
    public readonly stock: PartStock,

    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    referenceValue: string,
    nameValue: string,
    costValue: number,
    stockValue: number,
    createdAt: Date,
    updatedAt: Date
  ) {
    const reference = PartReference.from(referenceValue);
    if (reference instanceof Error) {
      return reference;
    }

    const name = PartName.from(nameValue);
    if (name instanceof Error) {
      return name;
    }

    const cost = PartCost.from(costValue.toString());
    if (cost instanceof Error) {
      return cost;
    }

    const stock = PartStock.from(stockValue.toString());
    if (stock instanceof Error) {
      return stock;
    }

    return new Part(
      identifier,
      reference,
      name,
      cost,
      stock,
      createdAt,
      updatedAt
    );
  }

  public static create(
    reference: string,
    name: string,
    cost: number,
    stock: number
  ) {
    const identifier = randomUUID();
    const createdAt = new Date();
    const updatedAt = new Date();

    return Part.from(
      identifier,
      reference,
      name,
      cost,
      stock,
      createdAt,
      updatedAt
    );
  }

  public static update(
    part: Part,
    stock: number,
    reference: string,
    name: string,
    cost: number
  ) {
    const newStock = PartStock.from(stock.toString());
    if (newStock instanceof Error) {
      return newStock;
    }

    const newReference = PartReference.from(reference);
    if (newReference instanceof Error) {
      return newReference;
    }

    const newName = PartName.from(name);
    if (newName instanceof Error) {
      return newName;
    }

    const newCost = PartCost.from(cost.toString());
    if (newCost instanceof Error) {
      return newCost;
    }

    return new Part(
      part.identifier,
      newReference,
      newName,
      newCost,
      newStock,
      part.createdAt,
      new Date()
    );
  }
}
