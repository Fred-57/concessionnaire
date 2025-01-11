import { Entity } from "./Entity";

export class Motorcycle implements Entity {
  private constructor(
    /**
     * @description Immatriculation
     */
    public readonly identifier: string,

    /**
     * @description Kilométrage
     */
    public readonly mileage: number,

    /**
     * @description Date de mise en service
     */
    public readonly dateOfCommissioning: Date,

    /**
     * @description Statut
     */
    public readonly status: string,

    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    mileage: number,
    dateOfCommissioning: Date,
    status: string,
    createdAt: Date,
    updatedAt: Date
  ): Motorcycle {
    return new Motorcycle(
      identifier,
      mileage,
      dateOfCommissioning,
      status,
      createdAt,
      updatedAt
    );
  }
}
