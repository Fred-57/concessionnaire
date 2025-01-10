import { Driver } from "../../domain/entities/Driver";

export interface DriverRepository {
    save(driver: Driver): Promise<void>;
    findByIdentifier(identifier: number): Promise<Driver | null>;
    findByName(name: string): Promise<Driver | null>;
    findAll(): Promise<Driver[]>;
    delete(driver: Driver): Promise<void>;
    exists(driver: Driver): Promise<boolean>;
}