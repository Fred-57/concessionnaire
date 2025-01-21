import { BrandRepository } from "@application/repositories/BrandRepository";
import { Brand } from "@domain/entities/Brand";
import { BrandNotFoundError } from "@domain/errors/brand/BrandNotFoundError";
import { Usecase } from "../Usecase";

export class DeleteBrandUsecase implements Usecase<Brand> {
  public constructor(private readonly brandRepository: BrandRepository) {}

  public async execute(identifier: string) {
    const brand = await this.brandRepository.findByIdentifier(identifier);

    if (!brand) {
      throw new BrandNotFoundError();
    }

    await this.brandRepository.delete(brand);
  }
}
