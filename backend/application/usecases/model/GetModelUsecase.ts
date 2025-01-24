import { Model } from "@domain/entities/Model";
import { Usecase } from "../Usecase";
import { ModelRepository } from "@application/repositories/ModelRepository";
import { ModelNotFoundError } from "@domain/errors/model/ModelNotFoundError";

export class GetModelUsecase implements Usecase<Model> {
  public constructor(private readonly modelRepository: ModelRepository) {}

  public async execute(identifier: string) {
    const model = await this.modelRepository.findByIdentifier(identifier);

    if (!model) {
      throw new ModelNotFoundError();
    }

    return model;
  }
}
