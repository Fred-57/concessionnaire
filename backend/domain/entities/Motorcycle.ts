import { Entity } from "./Entity";
import { MotorcycleMileage } from "@domain/values/motorcycle/MotorcycleMileage";
import { MotorcycleStatus } from "@domain/values/motorcycle/MotorcycleStatus";

export class Motorcycle implements Entity {
  private constructor(
    /**
     * @description Numéro d'identification du véhicule (VIN)
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

    public readonly companyIdentifier: string,
    public readonly modelIdentifier: string,
    public readonly guaranteeIdentifier: string | null,
    public readonly rentalIdentifiers: string[],
    public readonly maintenanceIdentifiers: string[],

    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public static from(
    identifier: string,
    mileageValue: number,
    dateOfCommissioning: Date,
    statusValue: string,
    companyIdentifier: string,
    modelIdentifier: string,
    guaranteeIdentifier: string | null,
    rentalIdentifiers: string[],
    maintenanceIdentifiers: string[],
    createdAt: Date,
    updatedAt: Date
  ) {
    const mileage = MotorcycleMileage.from(mileageValue);

    if (mileage instanceof Error) {
      return mileage;
    }

    const status = MotorcycleStatus.from(statusValue);

    if (status instanceof Error) {
      return status;
    }

    return new Motorcycle(
      identifier,
      mileage,
      dateOfCommissioning,
      status,
      companyIdentifier,
      modelIdentifier,
      guaranteeIdentifier,
      rentalIdentifiers,
      maintenanceIdentifiers,
      createdAt,
      updatedAt
    );
  }

  public static create(
    identifier: string,
    mileage: number,
    dateOfCommissioning: Date,
    status: string,
    companyIdentifier: string,
    modelIdentifier: string,
    guaranteeIdentifier: string | null,
    rentalIdentifiers: string[],
    maintenanceIdentifiers: string[]
  ) {
    const createdAt = new Date();
    const updatedAt = new Date();

    return Motorcycle.from(
      identifier,
      mileage,
      dateOfCommissioning,
      status,
      companyIdentifier,
      modelIdentifier,
      guaranteeIdentifier,
      rentalIdentifiers,
      maintenanceIdentifiers,
      createdAt,
      updatedAt
    );
  }
}
