import { CompanyModel } from "./models/CompanyModel";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { Company } from "@domain/entities/Company";
import { CompanyNameTooShortError } from "@domain/errors/company/CompanyNameTooShortError";

export class MongoCompanyRepository implements CompanyRepository {
  async save(company: Company): Promise<void> {
    const companyDatabase = new CompanyModel({
      identifier: company.identifier,
      name: company.name.value,
      type: company.type,
    });
    await companyDatabase.save();
  }
  async update(company: Company): Promise<void> {
    const companyDatabase = await CompanyModel.findOne({
      identifier: company.identifier,
    });

    // La vérification de l'existence de l'entité en base de données est réalisée côté application
    // Donc le scénario suivant ne devrait pas se produire, mais on doit s'en prémunir
    if (!companyDatabase) {
      return;
    }

    companyDatabase.name = company.name.value;
    await companyDatabase.save();
  }

  async findByIdentifier(identifier: string): Promise<Company | null> {
    const companyDatabase = await CompanyModel.findOne({
      identifier: identifier,
    });

    if (!companyDatabase) {
      return null;
    }

    const company = Company.from(
      companyDatabase.identifier,
      companyDatabase.name,
      companyDatabase.type,
      companyDatabase.createdAt,
      companyDatabase.updatedAt
    );

    if (company instanceof CompanyNameTooShortError) {
      throw company;
    }

    return company;
  }

  async findByName(name: string): Promise<Company | null> {
    const companyDatabase = await CompanyModel.findOne({
      name,
    });

    if (!companyDatabase) {
      return null;
    }

    const company = Company.from(
      companyDatabase.identifier,
      companyDatabase.name,
      companyDatabase.type,
      companyDatabase.createdAt,
      companyDatabase.updatedAt
    );

    if (company instanceof CompanyNameTooShortError) {
      throw company;
    }

    return company;
  }

  async findAll(): Promise<Company[]> {
    const companiesDatabase = await CompanyModel.find();

    const companies: Company[] = [];

    for (const companyDatabase of companiesDatabase) {
      const company = Company.from(
        companyDatabase.identifier,
        companyDatabase.name,
        companyDatabase.type,
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
    await CompanyModel.findOneAndDelete({
      identifier: company.identifier,
    }).exec();
  }
}
