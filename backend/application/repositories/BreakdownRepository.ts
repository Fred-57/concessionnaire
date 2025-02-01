import { Breakdown } from "@domain/entities/Breakdown";

export interface BreakdownRepository {
  save(breakdown: Breakdown): Promise<void>;
  update(breakdown: Breakdown): Promise<void>;
  findByIdentifier(identifier: string): Promise<Breakdown | null>;
  findByRentalIdentifier(rentalIdentifier: string): Promise<Breakdown[]>;
  findByRentalIdentifierAndDate(
    rentalIdentifier: string,
    date: Date
  ): Promise<Breakdown | null>;
  findAll(): Promise<Breakdown[]>;
  delete(breakdown: Breakdown): Promise<void>;
}
