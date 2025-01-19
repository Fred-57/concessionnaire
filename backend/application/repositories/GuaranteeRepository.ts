import { Guarantee } from "@domain/entities/Guarantee";

export interface GuaranteeRepository {
  save(model: Guarantee): Promise<void>;
  update(model: Guarantee): Promise<void>;
  findByIdentifier(identifier: string): Promise<Guarantee | null>;
  findByName(name: string): Promise<Guarantee | null>;
  findAll(): Promise<Guarantee[]>;
  delete(model: Guarantee): Promise<void>;
}
