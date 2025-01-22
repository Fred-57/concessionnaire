import { Model } from "@domain/entities/Model";
import { ModelRepository } from "@application/repositories/ModelRepository";
import { PrismaClient } from "@prisma/client";
import { Brand } from "@domain/entities/Brand";

const prisma = new PrismaClient();

export class PostgresModelRepository implements ModelRepository {
  public async save(model: Model, brand: Model): Promise<void> {
    await prisma.model.create({
      data: {
        id: model.identifier,
        name: model.name.value,
        repairMileage: model.repairMileage,
        repairDeadline: model.repairDeadline.value,
        brandId: brand.identifier,
      },
    });
  }

  public async update(model: Model, brand: Brand): Promise<void> {
    await prisma.model.update({
      where: { id: model.identifier },
      data: {
        name: model.name.value,
        repairMileage: model.repairMileage,
        repairDeadline: model.repairDeadline.value,
        brandId: brand.identifier,
      },
    });
  }

  public async findByIdentifier(identifier: string): Promise<Model | null> {
    const modelDatabase = await prisma.model.findUnique({
      where: {
        id: identifier,
      },
    });

    if (!modelDatabase) {
      return null;
    }

    const model = Model.from(
      modelDatabase.id,
      modelDatabase.name,
      modelDatabase.repairMileage,
      modelDatabase.repairDeadline,
      modelDatabase.brandId,
      modelDatabase.createdAt,
      modelDatabase.updatedAt
    );

    if (model instanceof Error) {
      throw model;
    }

    return model;
  }

  public async findByName(name: string): Promise<Model | null> {
    const modelDatabase = await prisma.model.findFirst({
      where: {
        name,
      },
    });

    if (!modelDatabase) {
      return null;
    }

    const model = Model.from(
      modelDatabase.id,
      modelDatabase.name,
      modelDatabase.repairMileage,
      modelDatabase.repairDeadline,
      modelDatabase.brandId,
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
    const modelsDatabase = await prisma.model.findMany({
      where: {
        brandId: brandIdentifier,
      },
    });

    const models: Model[] = [];

    for (const modelDatabase of modelsDatabase) {
      const model = Model.from(
        modelDatabase.id,
        modelDatabase.name,
        modelDatabase.repairMileage,
        modelDatabase.repairDeadline,
        modelDatabase.brandId,
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
    const modelsDatabase = await prisma.model.findMany();

    const models: Model[] = [];

    for (const modelDatabase of modelsDatabase) {
      const model = Model.from(
        modelDatabase.id,
        modelDatabase.name,
        modelDatabase.repairMileage,
        modelDatabase.repairDeadline,
        modelDatabase.brandId,
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

  public async delete(id: string): Promise<void> {
    await prisma.model.delete({
      where: { id },
    });
  }
}
