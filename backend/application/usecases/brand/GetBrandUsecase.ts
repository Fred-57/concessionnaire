import { BrandRepository } from "@application/repositories/BrandRepository";
import { Brand } from "@domain/entities/Brand";
import { Usecase } from "../Usecase";
import { BrandNotFoundError } from "@domain/errors/brand/BrandNotFoundError";

export class GetBrandUsecase implements Usecase<Brand> {
  public constructor(private readonly brandRepository: BrandRepository) {}

  public async execute(identifier: string) {
    const brand = await this.brandRepository.findByIdentifier(identifier);

    if (!brand) {
      throw new BrandNotFoundError();
    }

    return brand;
  }
}
