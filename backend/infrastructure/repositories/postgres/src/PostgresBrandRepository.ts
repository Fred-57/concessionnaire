import { BrandRepository } from "@application/repositories/BrandRepository";
import { PrismaClient } from "@prisma/client";
import { Brand } from "@domain/entities/Brand";
import { BrandNameTooShortError } from "@domain/errors/brand/BrandNameTooShortError";
import { Company } from "@domain/entities/Company";

const prisma = new PrismaClient();

export class PostgresBrandRepository implements BrandRepository {
  async save(brand: Brand, company: Company): Promise<void> {
    await prisma.brand.create({
      data: {
        id: brand.identifier,
        name: brand.name.value,
        companyId: company.identifier,
      },
    });
  }

  async update(brand: Brand, company: Company): Promise<void> {
    await prisma.brand.update({
      where: { id: brand.identifier, companyId: company.identifier },
      data: {
        name: brand.name.value,
        companyId: company.identifier,
      },
    });
  }

  async findByIdentifier(
    identifier: string,
    company: Company
  ): Promise<Brand | null> {
    const brandDatabase = await prisma.brand.findUnique({
      where: {
        id: identifier,
        // Pas nécessaire comme brand id déjà unique (UUID)
        companyId: company.identifier,
      },
    });

    if (!brandDatabase) {
      return null;
    }

    const brand = Brand.from(
      brandDatabase.id,
      brandDatabase.name,
      brandDatabase.companyId,
      brandDatabase.createdAt,
      brandDatabase.updatedAt
    );

    if (brand instanceof BrandNameTooShortError) {
      throw brand;
    }

    return brand;
  }

  async findByName(name: string, company: Company): Promise<Brand | null> {
    const brandDatabase = await prisma.brand.findFirst({
      where: {
        name,
        companyId: company.identifier,
      },
    });

    if (!brandDatabase) {
      return null;
    }

    const brand = Brand.from(
      brandDatabase.id,
      brandDatabase.name,
      brandDatabase.companyId,
      brandDatabase.createdAt,
      brandDatabase.updatedAt
    );

    if (brand instanceof BrandNameTooShortError) {
      throw brand;
    }

    return brand;
  }

  async findAll(company: Company): Promise<Brand[]> {
    const brandDatabases = await prisma.brand.findMany({
      where: { companyId: company.identifier },
    });

    const brands: Brand[] = [];

    for (const brandDatabase of brandDatabases) {
      const brand = Brand.from(
        brandDatabase.id,
        brandDatabase.name,
        brandDatabase.companyId,
        brandDatabase.createdAt,
        brandDatabase.updatedAt
      );

      if (brand instanceof BrandNameTooShortError) {
        throw brand;
      }

      brands.push(brand);
    }

    return brands;
  }

  async delete(brand: Brand, company: Company): Promise<void> {
    await prisma.brand.delete({
      where: { id: brand.identifier, companyId: company.identifier },
    });
  }
}
