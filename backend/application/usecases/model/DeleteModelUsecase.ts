import { Model } from "@domain/entities/Model";
import { Usecase } from "../Usecase";
import { ModelRepository } from "@application/repositories/ModelRepository";
import { ModelNotFoundError } from "@domain/errors/model/ModelNotFoundError";

export class DeleteModelUsecase implements Usecase<Model> {
  public constructor(private readonly modelRepository: ModelRepository) {}

  public async execute(identifier: string) {
    const modelExists = await this.modelRepository.findByIdentifier(identifier);

    if (!modelExists) {
      throw new ModelNotFoundError();
    }

    await this.modelRepository.delete(modelExists);
  }
}
