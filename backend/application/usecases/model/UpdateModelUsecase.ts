import { Model } from "@domain/entities/Model";
import { Usecase } from "../Usecase";
import { ModelRepository } from "@application/repositories/ModelRepository";
import { ModelNotFoundError } from "@domain/errors/model/ModelNotFoundError";
import { ModelNameAlreadyTakenError } from "@domain/errors/model/ModelNameAlreadyTakenError";

export class UpdateModelUsecase implements Usecase {
  public constructor(private readonly modelRepository: ModelRepository) {}

  public async execute(model: Model) {
    const modelExists = await this.modelRepository.findByIdentifier(
      model.identifier
    );

    if (!modelExists) {
      throw new ModelNotFoundError();
    }

    const nameExists = await this.modelRepository.findByName(model.name.value);

    if (nameExists && nameExists.identifier !== model.identifier) {
      throw new ModelNameAlreadyTakenError();
    }

    await this.modelRepository.update(model);
  }
}
