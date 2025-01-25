import { Model } from "@domain/entities/Model";
import { Usecase } from "../Usecase";
import { ModelRepository } from "@application/repositories/ModelRepository";
import { ModelNotFoundError } from "@domain/errors/model/ModelNotFoundError";
import { ModelNameAlreadyTakenError } from "@domain/errors/model/ModelNameAlreadyTakenError";
import { BrandRepository } from "@application/repositories/BrandRepository";
import { BrandNotFoundError } from "@domain/errors/brand/BrandNotFoundError";

export class UpdateModelUsecase implements Usecase<Model> {
  public constructor(
    private readonly modelRepository: ModelRepository,
    private readonly brandRepository: BrandRepository
  ) {}

  public async execute(model: Model) {
    const modelExists = await this.modelRepository.findByIdentifier(
      model.identifier
    );

    if (!modelExists) {
      throw new ModelNotFoundError();
    }

    const nameExists = await this.modelRepository.findByName(model.name.value);

    // if the name exists and the identifier is different, then the name is already taken
    if (nameExists && nameExists.identifier !== model.identifier) {
      throw new ModelNameAlreadyTakenError();
    }

    const brandExists = await this.brandRepository.findByIdentifier(
      model.brandIdentifier
    );

    if (!brandExists) {
      throw new BrandNotFoundError();
    }

    await this.modelRepository.update(model, brandExists);
  }
}
