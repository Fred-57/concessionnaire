import { ModelRepository } from "@application/repositories/ModelRepository";
import { ModelModel } from "./models/ModelModel";
import { Model } from "@domain/entities/Model";

export class MongoModelRepository implements ModelRepository {
  public async save(model: Model): Promise<void> {
    const modelDatabase = new ModelModel({
      identifier: model.identifier,
      name: model.name.value,
      repairMileage: model.repairMileage,
      repairDeadline: model.repairDeadline.value,
    });

    await modelDatabase.save();
  }

  public async update(model: Model): Promise<void> {
    await ModelModel.updateOne(
      { identifier: model.identifier },
      {
        name: model.name.value,
        repairMileage: model.repairMileage,
        repairDeadline: model.repairDeadline.value,
      }
    );
  }

  public async findByIdentifier(identifier: string): Promise<Model | null> {
    const modelDatabase = await ModelModel.findOne({
      identifier: identifier,
    });

    if (!modelDatabase) {
      return null;
    }

    const model = Model.from(
      modelDatabase.identifier,
      modelDatabase.name,
      modelDatabase.repairMileage,
      modelDatabase.repairDeadline,
      modelDatabase.createdAt,
      modelDatabase.updatedAt
    );

    if (model instanceof Error) {
      throw model;
    }

    return model;
  }

  public async findByName(name: string): Promise<Model | null> {
    const modelDatabase = await ModelModel.findOne({
      name,
    });

    if (!modelDatabase) {
      return null;
    }

    const model = Model.from(
      modelDatabase.identifier,
      modelDatabase.name,
      modelDatabase.repairMileage,
      modelDatabase.repairDeadline,
      modelDatabase.createdAt,
      modelDatabase.updatedAt
    );

    if (model instanceof Error) {
      throw model;
    }

    return model;
  }

  public async findAll(): Promise<Model[]> {
    const modelDatabases = await ModelModel.find();

    const models: Model[] = [];

    for (const modelDatabase of modelDatabases) {
      const model = Model.from(
        modelDatabase.identifier,
        modelDatabase.name,
        modelDatabase.repairMileage,
        modelDatabase.repairDeadline,
        modelDatabase.createdAt,
        modelDatabase.updatedAt
      );

      if (model instanceof Error) {
        throw model;
      }

      models.push(model);
    }

    return models;
  }

  public async delete(model: Model): Promise<void> {
    await ModelModel.findOneAndDelete({ identifier: model.identifier }).exec();
  }

  public async updateRappelSendAt(model: Model, date: Date): Promise<void> {
    await ModelModel.updateOne(
      { identifier: model.identifier },
      { rappelSendAt: date }
    );
  }
}
