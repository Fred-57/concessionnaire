import { Company } from "@domain/entities/Company";
import { Usecase } from "../Usecase";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { CompanyNameAlreadyTakenError } from "@domain/errors/company/CompanyNameAlreadyTakenError";

export class CreateCompanyUsecase implements Usecase<Company> {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(company: Company) {
    const nameExists = await this.companyRepository.findByName(
      company.name.value
    );

    if (nameExists) {
      throw new CompanyNameAlreadyTakenError();
    }

    await this.companyRepository.save(company);
  }
}
