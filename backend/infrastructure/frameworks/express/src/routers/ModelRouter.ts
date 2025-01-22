import { Router } from "express";
import { ListModelsUsecase } from "@application/usecases/model/ListModelUsecase";
import {
  PostgresBrandRepository,
  PostgresModelRepository,
} from "@infrastructure/repositories/postgres/";
import { StatusCodes } from "http-status-codes";
import { Model } from "@domain/entities/Model";
import { CreateModelUsecase } from "@application/usecases/model/CreateModelUsecase";
import { UpdateModelUsecase } from "@application/usecases/model/UpdateModelUsecase";
import { GetModelUsecase } from "@application/usecases/model/GetModelUsecase";
import { DeleteModelUsecase } from "@application/usecases/model/DeleteModelUsecase";

export const ModelRouter = Router();

ModelRouter.get("/", async (_, res) => {
  const models = await new ListModelsUsecase(
    new PostgresModelRepository()
  ).execute();
  res.status(StatusCodes.OK).json(models);
});

ModelRouter.post("/", async (req, res) => {
  const { name, repairMileage, repairDeadline, brandIdentifier } = req.body;

  const model = Model.create(
    name,
    repairMileage,
    repairDeadline,
    brandIdentifier
  );

  if (model instanceof Error) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  try {
    await new CreateModelUsecase(
      new PostgresModelRepository(),
      new PostgresBrandRepository()
    ).execute(model);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }

  res.sendStatus(StatusCodes.CREATED);
});

ModelRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const model = await new GetModelUsecase(
      new PostgresModelRepository()
    ).execute(id);

    res.status(StatusCodes.OK).json(model);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.NOT_FOUND).send(error.name);
      return;
    }
  }
});

ModelRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, repairMileage, repairDeadline, brandIdentifier } = req.body;

  try {
    const model = await new GetModelUsecase(
      new PostgresModelRepository()
    ).execute(id);

    const updatedModel = Model.from(
      id,
      name,
      repairMileage,
      repairDeadline,
      brandIdentifier,
      model.createdAt,
      new Date()
    );

    if (updatedModel instanceof Error) {
      res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
    }

    await new UpdateModelUsecase(
      new PostgresModelRepository(),
      new PostgresBrandRepository()
    ).execute(updatedModel);

    res.sendStatus(StatusCodes.OK);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }
});

ModelRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await new DeleteModelUsecase(new PostgresModelRepository()).execute(id);

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.NOT_FOUND).send(error.name);
      return;
    }
  }
});
