import { Company } from "@domain/entities/Company";
import { Usecase } from "../Usecase";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";
import { CompanyNameAlreadyTakenError } from "@domain/errors/company/CompanyNameAlreadyTakenError";

export class UpdateCompanyUsecase implements Usecase<Company> {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(company: Company) {
    const companyExists = await this.companyRepository.findByIdentifier(
      company.identifier
    );

    if (!companyExists) {
      throw new CompanyNotFoundError();
    }

    const nameExists = await this.companyRepository.findByName(
      company.name.value
    );

    if (nameExists && nameExists.identifier !== company.identifier) {
      throw new CompanyNameAlreadyTakenError();
    }

    await this.companyRepository.update(company);
  }
}
