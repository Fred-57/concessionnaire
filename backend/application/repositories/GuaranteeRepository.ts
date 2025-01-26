import { Guarantee } from "@domain/entities/Guarantee";

export interface GuaranteeRepository {
  save(guarantee: Guarantee): Promise<void>;
  update(guarantee: Guarantee): Promise<void>;
  findByIdentifier(identifier: string): Promise<Guarantee | null>;
  findByName(name: string): Promise<Guarantee | null>;
  findAll(): Promise<Guarantee[]>;
  delete(guarantee: Guarantee): Promise<void>;
}
