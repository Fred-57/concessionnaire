import { Brand } from "@domain/entities/Brand";
import { Usecase } from "../Usecase";
import { BrandRepository } from "@application/repositories/BrandRepository";
import { BrandNotFoundError } from "@domain/errors/brand/BrandNotFoundError";
import { BrandNameAlreadyTakenError } from "@domain/errors/brand/BrandNameAlreadyTakenError";

export class UpdateBrandUsecase implements Usecase<Brand> {
  public constructor(private readonly brandRepository: BrandRepository) {}

  public async execute(brand: Brand) {
    const brandExists = await this.brandRepository.findByIdentifier(
      brand.identifier,
    );

    if (!brandExists) {
      throw new BrandNotFoundError();
    }

    const nameExists = await this.brandRepository.findByName(brand.name.value);

    if (nameExists && nameExists.identifier !== brand.identifier) {
      throw new BrandNameAlreadyTakenError();
    }

    await this.brandRepository.update(brand);
  }
}
