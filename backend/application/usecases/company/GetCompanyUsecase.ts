import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { Company } from "@domain/entities/Company";
import { Usecase } from "../Usecase";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";

export class GetCompanyUsecase implements Usecase<Company> {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(identifier: string) {
    const company = await this.companyRepository.findByIdentifier(identifier);

    if (!company) {
      throw new CompanyNotFoundError();
    }

    return company;
  }
}
