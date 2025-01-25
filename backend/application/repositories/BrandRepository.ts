import { Brand } from "@domain/entities/Brand";
import { Company } from "@domain/entities/Company";

export interface BrandRepository {
  save(brand: Brand, company: Company): Promise<void>;
  update(brand: Brand, company: Company): Promise<void>;
  findByIdentifier(identifier: string, company: Company): Promise<Brand | null>;
  findByName(name: string, company: Company): Promise<Brand | null>;
  findAll(company: Company): Promise<Brand[]>;
  delete(brand: Brand, company: Company): Promise<void>;
}
