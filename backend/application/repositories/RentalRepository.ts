import { Rental } from "../../domain/entities/Rental";

export interface RentalRepository {
  save(rental: Rental): Promise<void>;
  update(rental: Rental): Promise<void>;
  findAll(): Promise<Rental[]>;
  findByIdentifier(identifier: string): Promise<Rental | null>;
  findManyByCompanyIdentifier(companyIdentifier: string): Promise<Rental[]>;
  findManyByMotorcycleIdentifier(
    motorcycleIdentifier: string
  ): Promise<Rental[]>;
  findManyByDriverIdentifier(driverIdentifier: string): Promise<Rental[]>;
  delete(rental: Rental): Promise<void>;
}
