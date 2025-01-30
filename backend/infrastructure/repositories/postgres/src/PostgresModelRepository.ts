import { Model } from "@domain/entities/Model";
import { ModelRepository } from "@application/repositories/ModelRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PostgresModelRepository implements ModelRepository {
  public async save(model: Model): Promise<void> {
    await prisma.model.create({
      data: {
        id: model.identifier,
        name: model.name.value,
        repairMileage: model.repairMileage,
        repairDeadline: model.repairDeadline.value,
        rappelSendAt: model.rappelSendAt,
      },
    });
  }

  public async update(model: Model): Promise<void> {
    await prisma.model.update({
      where: { id: model.identifier },
      data: {
        name: model.name.value,
        repairMileage: model.repairMileage,
        repairDeadline: model.repairDeadline.value,
        rappelSendAt: model.rappelSendAt,
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
      modelDatabase.createdAt,
      modelDatabase.updatedAt,
      modelDatabase.rappelSendAt
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
      modelDatabase.createdAt,
      modelDatabase.updatedAt,
      modelDatabase.rappelSendAt
    );

    if (model instanceof Error) {
      throw model;
    }

    return model;
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
        modelDatabase.createdAt,
        modelDatabase.updatedAt,
        modelDatabase.rappelSendAt
      );

      if (model instanceof Error) {
        throw model;
      }

      models.push(model);
    }

    return models;
  }

  public async delete(model: Model): Promise<void> {
    await prisma.model.delete({
      where: { id: model.identifier },
    });
  }

  public async updateRappelSendAt(model: Model, date: Date): Promise<void> {
    await prisma.model.update({
      where: { id: model.identifier },
      data: { rappelSendAt: date },
    });
  }
}
