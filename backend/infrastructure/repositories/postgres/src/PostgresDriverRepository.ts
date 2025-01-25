import { DriverRepository } from "@application/repositories/DriverRepository";
import { PrismaClient } from "@prisma/client";
import { Driver } from "@domain/entities/Driver";
import { DriverNameTooShortError } from "@domain/errors/driver/DriverNameTooShortError";

const prisma = new PrismaClient();

export class PostgresDriverRepository implements DriverRepository {
  async save(driver: Driver): Promise<void> {
    await prisma.driver.create({
      data: {
        id: driver.identifier,
        name: driver.name.value,
        license: driver.license,
        numberOfYearsOfExperience: driver.numberOfYearsOfExperience,
      },
    });
  }

  async update(driver: Driver): Promise<void> {
    await prisma.driver.update({
      where: {
        id: driver.identifier,
      },
      data: {
        name: driver.name.value,
        license: driver.license,
        numberOfYearsOfExperience: driver.numberOfYearsOfExperience,
      },
    });
  }

  async findByIdentifier(identifier: string): Promise<Driver | null> {
    const driverDatabase = await prisma.driver.findUnique({
      where: {
        id: identifier,
      },
    });

    if (!driverDatabase) {
      return null;
    }

    const driver = Driver.from(
      driverDatabase.id,
      driverDatabase.name,
      driverDatabase.license,
      driverDatabase.numberOfYearsOfExperience,
      driverDatabase.createdAt,
      driverDatabase.updatedAt
    );

    if (driver instanceof DriverNameTooShortError) {
      throw driver;
    }

    return driver;
  }

  async findAll(): Promise<Driver[]> {
    const driversDatabase = await prisma.driver.findMany();

    const drivers: Driver[] = [];

    for (const driverDatabase of driversDatabase) {
      const driver = Driver.from(
        driverDatabase.id,
        driverDatabase.name,
        driverDatabase.license,
        driverDatabase.numberOfYearsOfExperience,
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
    await prisma.driver.delete({
      where: {
        id: driver.identifier,
      },
    });
  }
}
