import { Motorcycle } from "@domain/entities/Motorcycle";

export interface MotorcycleRepository {
  save(model: Motorcycle): Promise<void>;
  update(model: Motorcycle): Promise<void>;
  findByIdentifier(identifier: string): Promise<Motorcycle | null>;
  findManyByCompanyIdentifier(companyIdentifier: string): Promise<Motorcycle[]>;
  delete(model: Motorcycle): Promise<void>;
}
