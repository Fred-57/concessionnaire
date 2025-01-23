import { Driver } from "../../domain/entities/Driver";

export interface DriverRepository {
  save(driver: Driver): Promise<void>;
  update(driver: Driver): Promise<void>;
  findByIdentifier(identifier: string): Promise<Driver | null>;
  findAll(): Promise<Driver[]>;
  delete(driver: Driver): Promise<void>;
}
