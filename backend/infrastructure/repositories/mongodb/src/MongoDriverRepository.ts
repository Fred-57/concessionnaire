import { DriverModel } from "./models/DriverModel";
import { DriverRepository } from "./../../../../application/repositories/DriverRepository";
import { Driver } from "@domain/entities/Driver";

export class MongoDriverRepository implements DriverRepository {
  save(driver: Driver): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findByIdentifier(identifier: string): Promise<Driver | null> {
    throw new Error("Method not implemented.");
  }
  findAll(): Promise<Driver[]> {
    throw new Error("Method not implemented.");
  }
  delete(driver: Driver): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
