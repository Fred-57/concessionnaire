import { PostgresModelRepository } from "@infrastructure/repositories/postgres";
import { Injectable } from "@nestjs/common";
import { ListModelsUsecase } from "@application/usecases/model/ListModelsUsecase";
import { GetModelUsecase } from "@application/usecases/model/GetModelUsecase";
import { CreateModelUsecase } from "@application/usecases/model/CreateModelUsecase";
import { UpdateModelUsecase } from "@application/usecases/model/UpdateModelUsecase";
import { DeleteModelUsecase } from "@application/usecases/model/DeleteModelUsecase";
import { Model } from "@domain/entities/Model";
import { CreateModelDto, UpdateModelDto } from "./models.dto";
@Injectable()
export class ModelsService {
  private readonly modelsRepository: PostgresModelRepository;
  private readonly listModelsUsecase: ListModelsUsecase;
  private readonly getModelUsecase: GetModelUsecase;
  private readonly createModelUsecase: CreateModelUsecase;
  private readonly updateModelUsecase: UpdateModelUsecase;
  private readonly deleteModelUsecase: DeleteModelUsecase;

  constructor() {
    this.modelsRepository = new PostgresModelRepository();
    this.listModelsUsecase = new ListModelsUsecase(this.modelsRepository);
    this.getModelUsecase = new GetModelUsecase(this.modelsRepository);
    this.createModelUsecase = new CreateModelUsecase(this.modelsRepository);
    this.updateModelUsecase = new UpdateModelUsecase(this.modelsRepository);
    this.deleteModelUsecase = new DeleteModelUsecase(this.modelsRepository);
  }

  async findAll() {
    return this.listModelsUsecase.execute();
  }

  async findOne(identifier: string) {
    return this.getModelUsecase.execute(identifier);
  }

  async create(createModelDto: CreateModelDto) {
    const model = Model.create(
      createModelDto.name,
      createModelDto.repairMileage,
      createModelDto.repairDeadline,
    );

    if (model instanceof Error) {
      return model;
    }

    return this.createModelUsecase.execute(model);
  }

  async update(identifier: string, updateModelDto: UpdateModelDto) {
    const model = await this.findOne(identifier);

    if (model instanceof Error) {
      return model;
    }

    const updatedModel = Model.from(
      model.identifier,
      updateModelDto.name,
      updateModelDto.repairMileage,
      updateModelDto.repairDeadline,
      model.createdAt,
      new Date(),
    );

    if (updatedModel instanceof Error) {
      return updatedModel;
    }

    return this.updateModelUsecase.execute(updatedModel);
  }

  async delete(identifier: string) {
    const model = await this.findOne(identifier);

    if (model instanceof Error) {
      return model;
    }

    return this.deleteModelUsecase.execute(model.identifier);
  }
}
