import { BrandRepository } from "@application/repositories/BrandRepository";
import { Brand } from "@domain/entities/Brand";
import { Usecase } from "../Usecase";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";

export class ListBrandsUsecase implements Usecase<Brand[]> {
  public constructor(
    private readonly brandRepository: BrandRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  public async execute(companyIdentifier: string) {
    const company =
      await this.companyRepository.findByIdentifier(companyIdentifier);

    if (!company) {
      throw new CompanyNotFoundError();
    }

    const brands = await this.brandRepository.findAll(company);
    return brands;
  }
}
