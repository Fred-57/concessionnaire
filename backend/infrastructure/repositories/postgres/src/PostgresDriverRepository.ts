import { DriverRepository } from "@application/repositories/DriverRepository";
import { PrismaClient } from "@prisma/client";
import { Driver } from "@domain/entities/Driver";
import { Company } from "@domain/entities/Company";
import { DriverNameTooShortError } from "@domain/errors/driver/DriverNameTooShortError";
import { CompanyTypeEnum } from "@domain/types/CompanyTypeEnum";
const prisma = new PrismaClient();

export class PostgresDriverRepository implements DriverRepository {
  async save(driver: Driver, company: Company): Promise<void> {
    await prisma.driver.create({
      data: {
        id: driver.identifier,
        name: driver.name.value,
        license: driver.license,
        numberOfYearsOfExperience: driver.numberOfYearsOfExperience,
        company: {
          connect: {
            id: company.identifier,
          },
        },
      },
    });
  }

  async update(driver: Driver, company: Company): Promise<void> {
    await prisma.driver.update({
      where: {
        id: driver.identifier,
      },
      data: {
        name: driver.name.value,
        license: driver.license,
        numberOfYearsOfExperience: driver.numberOfYearsOfExperience,
        company: {
          connect: {
            id: company.identifier,
          },
        },
      },
    });
  }

  async findByIdentifier(identifier: string): Promise<Driver | null> {
    const driverDatabase = await prisma.driver.findUnique({
      where: {
        id: identifier,
      },
      include: {
        company: true,
      },
    });

    if (!driverDatabase) {
      return null;
    }

    const company = Company.from(
      driverDatabase.company.id,
      driverDatabase.company.name,
      driverDatabase.company.type as CompanyTypeEnum,
      driverDatabase.company.createdAt,
      driverDatabase.company.updatedAt
    );

    if (company instanceof Error) {
      throw company;
    }

    const driver = Driver.from(
      driverDatabase.id,
      driverDatabase.name,
      driverDatabase.license,
      driverDatabase.numberOfYearsOfExperience,
      company.identifier,
      driverDatabase.createdAt,
      driverDatabase.updatedAt
    );

    if (driver instanceof DriverNameTooShortError) {
      throw driver;
    }

    return driver;
  }

  async findByName(name: string, company: Company): Promise<Driver | null> {
    const driverDatabase = await prisma.driver.findFirst({
      where: {
        name,
        company: {
          id: company.identifier,
        },
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
      driverDatabase.companyId,
      driverDatabase.createdAt,
      driverDatabase.updatedAt
    );

    if (driver instanceof DriverNameTooShortError) {
      throw driver;
    }

    return driver;
  }

  async findAllByCompany(company: Company): Promise<Driver[]> {
    const driversDatabase = await prisma.driver.findMany({
      where: {
        company: {
          id: company.identifier,
        },
      },
    });

    const drivers: Driver[] = [];

    for (const driverDatabase of driversDatabase) {
      const driver = Driver.from(
        driverDatabase.id,
        driverDatabase.name,
        driverDatabase.license,
        driverDatabase.numberOfYearsOfExperience,
        driverDatabase.companyId,
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
