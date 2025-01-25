import { CompanyModel } from "./models/CompanyModel";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { Company } from "@domain/entities/Company";
import { CompanyNameTooShortError } from "@domain/errors/compagny/CompanyNameTooShortError";

export class MongoCompanyRepository implements CompanyRepository {
  async save(compagny: Company): Promise<void> {
    const compagnyDatabase = new CompanyModel({
      identifier: compagny.identifier,
      name: compagny.name.value,
    });
    await compagnyDatabase.save();
  }
  async update(compagny: Company): Promise<void> {
    const compagnyDatabase = await CompanyModel.findOne({
      identifier: compagny.identifier,
    });

    // La vérification de l'existence de l'entité en base de données est réalisée côté application
    // Donc le scénario suivant ne devrait pas se produire, mais on doit s'en prémunir
    if (!compagnyDatabase) {
      return;
    }

    compagnyDatabase.name = compagny.name.value;
    await compagnyDatabase.save();
  }

  async findByIdentifier(identifier: string): Promise<Company | null> {
    const compagnyDatabase = await CompanyModel.findOne({
      identifier: identifier,
    });

    if (!compagnyDatabase) {
      return null;
    }

    const compagny = Company.from(
      compagnyDatabase.identifier,
      compagnyDatabase.name,
      compagnyDatabase.createdAt,
      compagnyDatabase.updatedAt
    );

    if (compagny instanceof CompanyNameTooShortError) {
      throw compagny;
    }

    return compagny;
  }

  async findByName(name: string): Promise<Company | null> {
    const compagnyDatabase = await CompanyModel.findOne({
      name,
    });

    if (!compagnyDatabase) {
      return null;
    }

    const compagny = Company.from(
      compagnyDatabase.identifier,
      compagnyDatabase.name,
      compagnyDatabase.createdAt,
      compagnyDatabase.updatedAt
    );

    if (compagny instanceof CompanyNameTooShortError) {
      throw compagny;
    }

    return compagny;
  }

  async findAll(): Promise<Company[]> {
    const compagniesDatabase = await CompanyModel.find();

    const companies: Company[] = [];

    for (const compagnyDatabase of compagniesDatabase) {
      const compagny = Company.from(
        compagnyDatabase.identifier,
        compagnyDatabase.name,
        compagnyDatabase.createdAt,
        compagnyDatabase.updatedAt
      );

      if (compagny instanceof CompanyNameTooShortError) {
        throw compagny;
      }

      compagnies.push(compagny);
    }

    return companies;
  }

  async delete(compagny: Company): Promise<void> {
    await CompanyModel.findOneAndDelete({
      identifier: compagny.identifier,
    }).exec();
  }
}
