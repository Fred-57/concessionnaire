import { BrandModel } from "./models/BrandModel";
import { BrandRepository } from "@application/repositories/BrandRepository";
import { Brand } from "@domain/entities/Brand";
import { Company } from "@domain/entities/Company";
import { BrandNameTooShortError } from "@domain/errors/brand/BrandNameTooShortError";

export class MongoBrandRepository implements BrandRepository {
  async save(brand: Brand, company: Company): Promise<void> {
    const brandDatabase = new BrandModel({
      identifier: brand.identifier,
      name: brand.name.value,
      company: {
        identifier: company.identifier,
        name: company.name.value,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
    });
    await brandDatabase.save();
  }

  async update(brand: Brand, company: Company): Promise<void> {
    const brandDatabase = await BrandModel.findOne({
      identifier: brand.identifier,
    });

    // La vérification de l'existence de l'entité en base de données est réalisée côté application
    // Donc le scénario suivant ne devrait pas se produire, mais on doit s'en prémunir
    if (!brandDatabase) {
      return;
    }

    brandDatabase.name = brand.name.value;
    await brandDatabase.save();
  }

  async findByIdentifier(
    identifier: string,
    company: Company
  ): Promise<Brand | null> {
    const brandDatabase = await BrandModel.findOne({
      identifier: identifier,
      company: {
        identifier: company.identifier,
      },
    });

    if (!brandDatabase) {
      return null;
    }

    const brand = Brand.from(
      brandDatabase.identifier,
      brandDatabase.name,
      brandDatabase.company.identifier,
      brandDatabase.createdAt,
      brandDatabase.updatedAt
    );

    if (brand instanceof BrandNameTooShortError) {
      throw brand;
    }

    return brand;
  }

  async findByName(name: string, company: Company): Promise<Brand | null> {
    const brandDatabase = await BrandModel.findOne({
      name,
    });

    if (!brandDatabase) {
      return null;
    }

    const brand = Brand.from(
      brandDatabase.identifier,
      brandDatabase.name,
      brandDatabase.company.identifier,
      brandDatabase.createdAt,
      brandDatabase.updatedAt
    );

    if (brand instanceof BrandNameTooShortError) {
      throw brand;
    }

    return brand;
  }

  async findAll(company: Company): Promise<Brand[]> {
    const brandsDatabase = await BrandModel.find({
      company: {
        identifier: company.identifier,
      },
    });

    const brands: Brand[] = [];

    for (const brandDatabase of brandsDatabase) {
      const brand = Brand.from(
        brandDatabase.identifier,
        brandDatabase.name,
        brandDatabase.company.identifier,
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
    await BrandModel.findOneAndDelete({
      identifier: brand.identifier,
      company: {
        identifier: company.identifier,
      },
    }).exec();
  }
}
