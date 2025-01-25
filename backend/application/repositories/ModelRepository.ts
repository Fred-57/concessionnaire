import { Model } from "@domain/entities/Model";

export interface ModelRepository {
  save(model: Model): Promise<void>;
  update(model: Model): Promise<void>;
  findByIdentifier(identifier: string): Promise<Model | null>;
  findByName(name: string): Promise<Model | null>;
  findAll(): Promise<Model[]>;
  delete(id: string): Promise<void>;
}
