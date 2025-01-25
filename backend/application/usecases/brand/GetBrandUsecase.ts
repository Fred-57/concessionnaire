import { BrandRepository } from "@application/repositories/BrandRepository";
import { Brand } from "@domain/entities/Brand";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { Usecase } from "../Usecase";
import { BrandNotFoundError } from "@domain/errors/brand/BrandNotFoundError";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";

export class GetBrandUsecase implements Usecase<Brand> {
  public constructor(
    private readonly brandRepository: BrandRepository,
    private readonly companyRepository: CompanyRepository
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

    return brand;
  }
}
