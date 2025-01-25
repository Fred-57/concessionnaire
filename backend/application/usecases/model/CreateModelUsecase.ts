import { Model } from "@domain/entities/Model";
import { Usecase } from "../Usecase";
import { ModelRepository } from "@application/repositories/ModelRepository";
import { ModelNameAlreadyTakenError } from "@domain/errors/model/ModelNameAlreadyTakenError";

export class CreateModelUsecase implements Usecase<Model> {
  public constructor(private readonly modelRepository: ModelRepository) {}

  public async execute(model: Model) {
    const nameExists = await this.modelRepository.findByName(model.name.value);

    if (nameExists) {
      throw new ModelNameAlreadyTakenError();
    }

    await this.modelRepository.save(model);
  }
}
