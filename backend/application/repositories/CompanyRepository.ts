import { Company } from "@domain/entities/Company";

export interface CompanyRepository {
  save(company: Company): Promise<void>;
  update(company: Company): Promise<void>;
  findByIdentifier(identifier: string): Promise<Company | null>;
  findByName(name: string): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  delete(company: Company): Promise<void>;
}
