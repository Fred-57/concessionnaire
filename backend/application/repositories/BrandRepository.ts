import { Brand } from "@domain/entities/Brand";

export interface BrandRepository {
  save(brand: Brand): Promise<void>;
  update(brand: Brand): Promise<void>;
  findByIdentifier(identifier: string): Promise<Brand | null>;
  findByName(name: string): Promise<Brand | null>;
  findAll(): Promise<Brand[]>;
  delete(brand: Brand): Promise<void>;
}
