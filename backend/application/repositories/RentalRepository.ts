import { Rental } from "../../domain/entities/Rental";

export interface RentalRepository {
  save(rental: Rental): Promise<void>;
  update(rental: Rental): Promise<void>;
  findByIdentifier(identifier: string): Promise<Rental | null>;
  findManyByCompanyIdentifier(companyIdentifier: string): Promise<Rental[]>;
  delete(rental: Rental): Promise<void>;
}
