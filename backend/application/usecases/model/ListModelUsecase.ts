import { Model } from "@domain/entities/Model";
import { Usecase } from "../Usecase";
import { ModelRepository } from "@application/repositories/ModelRepository";

export class ListModelsUsecase implements Usecase<Model[]> {
  public constructor(private readonly modelRepository: ModelRepository) {}

  public async execute() {
    const models = await this.modelRepository.findAll();
    return models;
  }
}
