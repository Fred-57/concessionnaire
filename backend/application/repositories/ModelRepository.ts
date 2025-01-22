import { Brand } from "@domain/entities/Brand";
import { Model } from "@domain/entities/Model";

export interface ModelRepository {
  save(model: Model, brand: Brand): Promise<void>;
  update(model: Model, brand: Brand): Promise<void>;
  findByIdentifier(identifier: string): Promise<Model | null>;
  findByName(name: string): Promise<Model | null>;
  findByBrandIdentifier(brandIdentifier: string): Promise<Model[]>;
  findAll(): Promise<Model[]>;
  delete(id: string): Promise<void>;
}
