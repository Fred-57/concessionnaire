import { Company } from "@domain/entities/Company";
import { Driver } from "../../domain/entities/Driver";

export interface DriverRepository {
  save(driver: Driver, company: Company): Promise<void>;
  update(driver: Driver, company: Company): Promise<void>;
  findByIdentifier(identifier: string): Promise<Driver | null>;
  findByName(name: string, company: Company): Promise<Driver | null>;
  findAllByCompany(company: Company): Promise<Driver[]>;
  delete(driver: Driver): Promise<void>;
}
