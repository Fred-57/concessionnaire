import { ModelRepository } from "@application/repositories/ModelRepository";
import { ModelModel } from "./models/ModelModel";
import { Model } from "@domain/entities/Model";
import { Brand } from "@domain/entities/Brand";

export class MongoModelRepository implements ModelRepository {
  public async save(model: Model, brand: Brand): Promise<void> {
    const modelDatabase = new ModelModel({
      identifier: model.identifier,
      name: model.name.value,
      repairMileage: model.repairMileage,
      repairDeadline: model.repairDeadline.value,
      brand: {
        identifier: brand.identifier,
        name: brand.name.value,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
      },
    });

    await modelDatabase.save();
  }

  public async update(model: Model, brand: Brand): Promise<void> {
    await ModelModel.updateOne(
      { identifier: model.identifier },
      {
        name: model.name.value,
        repairMileage: model.repairMileage,
        repairDeadline: model.repairDeadline.value,
        brand: {
          identifier: brand.identifier,
          name: brand.name.value,
          createdAt: brand.createdAt,
          updatedAt: brand.updatedAt,
        },
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
      modelDatabase.brand.identifier,
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
      modelDatabase.brand.identifier,
      modelDatabase.createdAt,
      modelDatabase.updatedAt
    );

    if (model instanceof Error) {
      throw model;
    }

    return model;
  }

  public async findByBrandIdentifier(
    brandIdentifier: string
  ): Promise<Model[]> {
    const modelDatabases = await ModelModel.find({
      "brand.identifier": brandIdentifier,
    });

    const models: Model[] = [];

    for (const modelDatabase of modelDatabases) {
      const model = Model.from(
        modelDatabase.identifier,
        modelDatabase.name,
        modelDatabase.repairMileage,
        modelDatabase.repairDeadline,
        modelDatabase.brand.identifier,
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

  public async findAll(): Promise<Model[]> {
    const modelDatabases = await ModelModel.find();

    const models: Model[] = [];

    for (const modelDatabase of modelDatabases) {
      const model = Model.from(
        modelDatabase.identifier,
        modelDatabase.name,
        modelDatabase.repairMileage,
        modelDatabase.repairDeadline,
        modelDatabase.brand.identifier,
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

  public async delete(identifier: string): Promise<void> {
    await ModelModel.findOneAndDelete({ identifier }).exec();
  }
}
