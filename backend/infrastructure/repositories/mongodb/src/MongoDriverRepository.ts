import { DriverModel } from "./models/DriverModel";
import { DriverRepository } from "./../../../../application/repositories/DriverRepository";
import { Driver } from "@domain/entities/Driver";
import { DriverNameTooShortError } from "@domain/errors/driver/DriverNameTooShortError";
import { License } from "@domain/types/License";
import { Company } from "@domain/entities/Company";

export class MongoDriverRepository implements DriverRepository {
  async save(driver: Driver, company: Company): Promise<void> {
    const driverDatabase = new DriverModel({
      identifier: driver.identifier,
      name: driver.name.value,
      license: driver.license,
      numberOfYearsOfExperience: driver.numberOfYearsOfExperience,
      companyIdentifier: company.identifier,
    });

    await driverDatabase.save();
  }

  async update(driver: Driver, company: Company): Promise<void> {
    const driverDatabase = await DriverModel.findOne({
      identifier: driver.identifier,
    });

    if (!driverDatabase) {
      return;
    }

    driverDatabase.name = driver.name.value;
    driverDatabase.license = driver.license;
    driverDatabase.numberOfYearsOfExperience = driver.numberOfYearsOfExperience;
    driverDatabase.companyIdentifier = company.identifier;
    await driverDatabase.save();
  }

  async findByIdentifier(identifier: string): Promise<Driver | null> {
    const driverDatabase = await DriverModel.findOne({
      identifier: identifier,
    });

    if (!driverDatabase) {
      return null;
    }

    const driver = Driver.from(
      driverDatabase.identifier,
      driverDatabase.name,
      driverDatabase.license as License,
      driverDatabase.numberOfYearsOfExperience,
      driverDatabase.companyIdentifier,
      driverDatabase.createdAt,
      driverDatabase.updatedAt
    );

    if (driver instanceof DriverNameTooShortError) {
      throw driver;
    }

    return driver;
  }

  async findByName(name: string, company: Company): Promise<Driver | null> {
    const driverDatabase = await DriverModel.findOne({
      name: name,
      companyIdentifier: company.identifier,
    });

    if (!driverDatabase) {
      return null;
    }

    const driver = Driver.from(
      driverDatabase.identifier,
      driverDatabase.name,
      driverDatabase.license as License,
      driverDatabase.numberOfYearsOfExperience,
      driverDatabase.companyIdentifier,
      driverDatabase.createdAt,
      driverDatabase.updatedAt
    );

    if (driver instanceof DriverNameTooShortError) {
      throw driver;
    }

    return driver;
  }

  async findAllByCompany(company: Company): Promise<Driver[]> {
    const driversDatabase = await DriverModel.find({
      companyIdentifier: company.identifier,
    });

    const drivers: Driver[] = [];

    for (const driverDatabase of driversDatabase) {
      const driver = Driver.from(
        driverDatabase.identifier,
        driverDatabase.name,
        driverDatabase.license as License,
        driverDatabase.numberOfYearsOfExperience,
        driverDatabase.companyIdentifier,
        driverDatabase.createdAt,
        driverDatabase.updatedAt
      );

      if (driver instanceof DriverNameTooShortError) {
        throw driver;
      }

      drivers.push(driver);
    }

    return drivers;
  }

  async delete(driver: Driver): Promise<void> {
    await DriverModel.deleteOne({ identifier: driver.identifier });
  }
}
