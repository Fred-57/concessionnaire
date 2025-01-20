import { BrandRepository } from "@application/repositories/BrandRepository";
import { PrismaClient } from "@prisma/client";
import { Brand } from "@domain/entities/Brand";
import { BrandNameTooShortError } from "@domain/errors/brand/BrandNameTooShortError";

const prisma = new PrismaClient();

export class PostgresBrandRepository implements BrandRepository {
  async save(brand: Brand): Promise<void> {
    await prisma.brand.create({
      data: {
        id: brand.identifier,
        name: brand.name.value,
      },
    });
  }

  async update(brand: Brand): Promise<void> {
    await prisma.brand.update({
      where: { id: brand.identifier },
      data: {
        name: brand.name.value,
      },
    });
  }

  async findByIdentifier(identifier: string): Promise<Brand | null> {
    const brandDatabase = await prisma.brand.findUnique({
      where: {
        id: identifier,
      },
    });

    if (!brandDatabase) {
      return null;
    }

    const brand = Brand.from(
      brandDatabase.id,
      brandDatabase.name,
      brandDatabase.createdAt,
      brandDatabase.updatedAt,
    );

    if (brand instanceof BrandNameTooShortError) {
      throw brand;
    }

    return brand;
  }

  async findByName(name: string): Promise<Brand | null> {
    const brandDatabase = await prisma.brand.findFirst({
      where: {
        name,
      },
    });

    if (!brandDatabase) {
      return null;
    }

    const brand = Brand.from(
      brandDatabase.id,
      brandDatabase.name,
      brandDatabase.createdAt,
      brandDatabase.updatedAt,
    );

    if (brand instanceof BrandNameTooShortError) {
      throw brand;
    }

    return brand;
  }

  async findAll(): Promise<Brand[]> {
    const brandDatabases = await prisma.brand.findMany();

    const brands: Brand[] = [];

    for (const brandDatabase of brandDatabases) {
      const brand = Brand.from(
        brandDatabase.id,
        brandDatabase.name,
        brandDatabase.createdAt,
        brandDatabase.updatedAt,
      );

      if (brand instanceof BrandNameTooShortError) {
        throw brand;
      }

      brands.push(brand);
    }

    return brands;
  }

  async delete(brand: Brand): Promise<void> {
    await prisma.brand.delete({
      where: { id: brand.identifier },
    });
  }
}
