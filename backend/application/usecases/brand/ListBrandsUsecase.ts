import { BrandRepository } from "@application/repositories/BrandRepository";
import { Brand } from "@domain/entities/Brand";
import { Usecase } from "../Usecase";

export class ListBrandsUsecase implements Usecase<Brand[]> {
  public constructor(private readonly brandRepository: BrandRepository) {}

  public async execute() {
    const brands = await this.brandRepository.findAll();
    return brands;
  }
}
