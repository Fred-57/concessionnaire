import { Entity } from "./Entity";

export class Part implements Entity {
  private constructor(
    /**
     * @description Identifiant
     */
    public readonly identifier: string,

    /**
     * @description reference
     */
    public readonly reference: string,

    /**
     * @description Désignation
     */
    public readonly name: string,
    /**
     * @description Prix
     */
    public readonly cost: number,

    /**
     * @description Stock
     */
    public readonly stock: number,

    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    reference: string,
    name: string,
    cost: number,
    stock: number
  ): Part {
    return new Part(
      identifier,
      reference,
      name,
      cost,
      stock,
      new Date(),
      new Date()
    );
  }
}
