import { Brand } from "@domain/entities/Brand";
import { Usecase } from "../Usecase";
import { BrandRepository } from "@application/repositories/BrandRepository";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { BrandNameAlreadyTakenError } from "@domain/errors/brand/BrandNameAlreadyTakenError";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";
import { Company } from "@domain/entities/Company";
export class CreateBrandUsecase implements Usecase<Brand> {
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

    const nameExists = await this.brandRepository.findByName(
      brand.name.value,
      company
    );

    if (nameExists) {
      throw new BrandNameAlreadyTakenError();
    }

    await this.brandRepository.save(brand, company);
  }
}
