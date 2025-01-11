import { Part } from "../../domain/entities/Part";

export interface PartRepository {
  save(part: Part): Promise<void>;
  update(part: Part): Promise<void>;
  findByIdentifier(identifier: string): Promise<Part | null>;
  findByReference(reference: string): Promise<Part | null>;
  findAll(): Promise<Part[]>;
  delete(part: Part): Promise<void>;
}
