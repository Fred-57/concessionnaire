import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { Company } from "@domain/entities/Company";
import { Usecase } from "../Usecase";

export class ListCompaniesUsecase implements Usecase<Company[]> {
  public constructor(private readonly companyRepository: CompanyRepository) {}

  public async execute() {
    const companies = await this.companyRepository.findAll();
    return companies;
  }
}
