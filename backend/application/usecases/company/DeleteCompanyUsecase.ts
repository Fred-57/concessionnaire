import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { Company } from "@domain/entities/Company";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";
import { Usecase } from "../Usecase";

export class DeleteCompanyUsecase implements Usecase<Company> {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute(identifier: string) {
    const company = await this.companyRepository.findByIdentifier(identifier);

    if (!company) {
      throw new CompanyNotFoundError();
    }

    await this.companyRepository.delete(company);
  }
}
