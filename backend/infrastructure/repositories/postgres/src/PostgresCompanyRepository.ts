import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { PrismaClient } from "@prisma/client";
import { Company } from "@domain/entities/Company";
import { CompanyNameTooShortError } from "@domain/errors/company/CompanyNameTooShortError";

const prisma = new PrismaClient();

export class PostgresCompanyRepository implements CompanyRepository {
  async save(company: Company): Promise<void> {
    await prisma.company.create({
      data: {
        id: company.identifier,
        name: company.name.value,
      },
    });
  }

  async update(company: Company): Promise<void> {
    await prisma.company.update({
      where: { id: company.identifier },
      data: {
        name: company.name.value,
      },
    });
  }

  async findByIdentifier(identifier: string): Promise<Company | null> {
    const companyDatabase = await prisma.company.findUnique({
      where: {
        id: identifier,
      },
    });

    if (!companyDatabase) {
      return null;
    }

    const company = Company.from(
      companyDatabase.id,
      companyDatabase.name,
      companyDatabase.createdAt,
      companyDatabase.updatedAt
    );

    if (company instanceof CompanyNameTooShortError) {
      throw company;
    }

    return company;
  }

  async findByName(name: string): Promise<Company | null> {
    const companyDatabase = await prisma.company.findFirst({
      where: {
        name,
      },
    });

    if (!companyDatabase) {
      return null;
    }

    const company = Company.from(
      companyDatabase.id,
      companyDatabase.name,
      companyDatabase.createdAt,
      companyDatabase.updatedAt
    );

    if (company instanceof CompanyNameTooShortError) {
      throw company;
    }

    return company;
  }

  async findAll(): Promise<Company[]> {
    const companyDatabases = await prisma.company.findMany();

    const companies: Company[] = [];

    for (const companyDatabase of companyDatabases) {
      const company = Company.from(
        companyDatabase.id,
        companyDatabase.name,
        companyDatabase.createdAt,
        companyDatabase.updatedAt
      );

      if (company instanceof CompanyNameTooShortError) {
        throw company;
      }

      companies.push(company);
    }

    return companies;
  }

  async delete(company: Company): Promise<void> {
    await prisma.company.delete({
      where: { id: company.identifier },
    });
  }
}
