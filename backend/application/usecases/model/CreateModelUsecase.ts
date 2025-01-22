import { Model } from "@domain/entities/Model";
import { Usecase } from "../Usecase";
import { ModelRepository } from "@application/repositories/ModelRepository";
import { ModelNameAlreadyTakenError } from "@domain/errors/model/ModelNameAlreadyTakenError";
import { BrandRepository } from "@application/repositories/BrandRepository";
import { BrandNotFoundError } from "@domain/errors/brand/BrandNotFoundError";

export class CreateModelUsecase implements Usecase<Model> {
  public constructor(
    private readonly modelRepository: ModelRepository,
    private readonly brandRepository: BrandRepository
  ) {}

  public async execute(model: Model) {
    const nameExists = await this.modelRepository.findByName(model.name.value);

    if (nameExists) {
      throw new ModelNameAlreadyTakenError();
    }

    const brandExists = await this.brandRepository.findByIdentifier(
      model.brandIdentifier
    );

    if (!brandExists) {
      throw new BrandNotFoundError();
    }

    await this.modelRepository.save(model, brandExists);
  }
}
