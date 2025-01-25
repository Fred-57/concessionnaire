import { Brand } from "@domain/entities/Brand";
import { Usecase } from "../Usecase";
import { BrandRepository } from "@application/repositories/BrandRepository";
import { BrandNotFoundError } from "@domain/errors/brand/BrandNotFoundError";
import { BrandNameAlreadyTakenError } from "@domain/errors/brand/BrandNameAlreadyTakenError";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";

export class UpdateBrandUsecase implements Usecase<Brand> {
  public constructor(
    private readonly brandRepository: BrandRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  public async execute(brand: Brand, companyIdentifier: string) {
    const company =
      await this.companyRepository.findByIdentifier(companyIdentifier);

    if (!company) {
      throw new CompanyNotFoundError();
    }

    const brandExists = await this.brandRepository.findByIdentifier(
      brand.identifier,
      company
    );

    if (!brandExists) {
      throw new BrandNotFoundError();
    }

    const nameExists = await this.brandRepository.findByName(
      brand.name.value,
      company
    );

    if (nameExists && nameExists.identifier !== brand.identifier) {
      throw new BrandNameAlreadyTakenError();
    }

    await this.brandRepository.update(brand, company);
  }
}
