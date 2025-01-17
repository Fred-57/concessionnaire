import { Entity } from "./Entity";
import { MotorcycleMileage } from "@domain/values/motorcycle/MotorcycleMileage";
import { MotorcycleStatus } from "@domain/values/motorcycle/MotorcycleStatus";

export class Motorcycle implements Entity {
  private constructor(
    /**
     * @description Immatriculation
     */
    public readonly identifier: string,

    /**
     * @description Kilométrage
     */
    public readonly mileage: MotorcycleMileage,

    /**
     * @description Date de mise en service
     */
    public readonly dateOfCommissioning: Date,

    public readonly status: MotorcycleStatus,
    public readonly modelIdentifier: string,

    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    mileageValue: number,
    dateOfCommissioning: Date,
    statusValue: string,
    modelIdentifier: string,
    createdAt: Date,
    updatedAt: Date
  ): Motorcycle {
    const mileage = MotorcycleMileage.from(mileageValue);

    if (mileage instanceof Error) {
      throw mileage;
    }

    const status = MotorcycleStatus.from(statusValue);

    if (status instanceof Error) {
      throw status;
    }

    return new Motorcycle(
      identifier,
      mileage,
      dateOfCommissioning,
      status,
      modelIdentifier,
      createdAt,
      updatedAt
    );
  }

  public static create(
    identifier: string,
    mileage: number,
    dateOfCommissioning: Date,
    status: string,
    modelIdentifier: string
  ): Motorcycle {
    const createdAt = new Date();
    const updatedAt = new Date();

    return Motorcycle.from(
      identifier,
      mileage,
      dateOfCommissioning,
      status,
      modelIdentifier,
      createdAt,
      updatedAt
    );
  }
}
