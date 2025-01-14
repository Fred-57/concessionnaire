import { Brand } from "@domain/entities/Brand";

export interface BrandRepository {
  save(model: Brand): Promise<void>;
  update(model: Brand): Promise<void>;
  findByIdentifier(identifier: string): Promise<Brand | null>;
  findByName(name: string): Promise<Brand | null>;
  findAll(): Promise<Brand[]>;
  delete(model: Brand): Promise<void>;
}
