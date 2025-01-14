import { Brand } from "@domain/entities/Brand";
import { Usecase } from "../Usecase";
import { BrandRepository } from "@application/repositories/BrandRepository";
import { BrandNameAlreadyTakenError } from "@domain/errors/brand/BrandNameAlreadyTakenError";

export class CreateBrandUsecase implements Usecase {
  public constructor(private readonly brandRepository: BrandRepository) {}

  public async execute(brand: Brand) {
    const nameExists = await this.brandRepository.findByName(brand.name.value);

    if (nameExists) {
      throw new BrandNameAlreadyTakenError();
    }

    await this.brandRepository.save(brand);
  }
}
