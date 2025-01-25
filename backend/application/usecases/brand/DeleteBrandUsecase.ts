import { BrandRepository } from "@application/repositories/BrandRepository";
import { Brand } from "@domain/entities/Brand";
import { BrandNotFoundError } from "@domain/errors/brand/BrandNotFoundError";
import { Usecase } from "../Usecase";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";

export class DeleteBrandUsecase implements Usecase<Brand> {
  public constructor(
    private readonly brandRepository: BrandRepository,
    private companyRepository: CompanyRepository
  ) {}

  public async execute(identifier: string, companyIdentifier: string) {
    const company =
      await this.companyRepository.findByIdentifier(companyIdentifier);

    if (!company) {
      throw new CompanyNotFoundError();
    }

    const brand = await this.brandRepository.findByIdentifier(
      identifier,
      company
    );

    if (!brand) {
      throw new BrandNotFoundError();
    }

    await this.brandRepository.delete(brand, company);
  }
}
