import { Motorcycle } from "@domain/entities/Motorcycle";
import { MotorcycleStatusEnum } from "@domain/types/MotorcycleStatusEnum";

export interface MotorcycleRepository {
  save(model: Motorcycle): Promise<void>;
  update(model: Motorcycle): Promise<void>;
  findByIdentifier(identifier: string): Promise<Motorcycle | null>;
  findByStatus(status: MotorcycleStatusEnum): Promise<Motorcycle[]>;
  findByModelIdentifier(modelIdentifier: string): Promise<Motorcycle[]>;
  findAll(): Promise<Motorcycle[]>;
  delete(model: Motorcycle): Promise<void>;
}
