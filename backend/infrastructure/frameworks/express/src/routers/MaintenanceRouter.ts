import { CreateMaintenanceUsecase } from "@application/usecases/maintenance/CreateMaintenanceUsecase";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  MongoMaintenanceRepository,
  MongoPartRepository,
} from "@infrastructure/repositories/mongodb";
import { ListMaintenancesUsecase } from "@application/usecases/maintenance/ListMaintenanceUsecase";
import { UpdateMaintenanceUsecase } from "@application/usecases/maintenance/UpdateMaintenanceUsecase";
import { DeleteMaintenanceUsecase } from "@application/usecases/maintenance/DeleteMaintenanceUsecase";
import { GetMaintenanceUsecase } from "@application/usecases/maintenance/GetMaintenanceUsecase";
import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceNotFoundError } from "@domain/errors/maintenance/MaintenanceNotFoundError";

export const MaintenanceRouter = Router();

MaintenanceRouter.get("/", async (_, res) => {
  try {
    const maintenances = await new ListMaintenancesUsecase(
      new MongoMaintenanceRepository()
    ).execute();

    res.status(StatusCodes.OK).json(maintenances);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }
});

MaintenanceRouter.post("/", async (req, res) => {
  try {
    const { date, recommendation, motorcycleIdentifier, parts } = req.body;

    const maintenance = Maintenance.create(
      date,
      recommendation,
      motorcycleIdentifier,
      parts
    );

    if (maintenance instanceof Error) {
      res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
    }

    await new CreateMaintenanceUsecase(
      new MongoMaintenanceRepository(),
      new MongoPartRepository()
    ).execute(maintenance);

    res.status(StatusCodes.OK).json(maintenance);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }
});

MaintenanceRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, recommendation, motorcycleIdentifier, parts } = req.body;

    const maintenance = await new GetMaintenanceUsecase(
      new MongoMaintenanceRepository()
    ).execute(id);

    if (maintenance instanceof MaintenanceNotFoundError) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }

    const updatedMaintenance = Maintenance.update(
      maintenance,
      date,
      recommendation,
      motorcycleIdentifier,
      parts
    );

    if (updatedMaintenance instanceof Error) {
      res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
    }

    await new UpdateMaintenanceUsecase(
      new MongoMaintenanceRepository(),
      new MongoPartRepository()
    ).execute(updatedMaintenance);

    res.sendStatus(StatusCodes.OK);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }
});

MaintenanceRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const maintenance = await new GetMaintenanceUsecase(
      new MongoMaintenanceRepository()
    ).execute(id);

    if (!maintenance) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }

    await new DeleteMaintenanceUsecase(
      new MongoMaintenanceRepository()
    ).execute(id);

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }
});

MaintenanceRouter.get("/:id", async (req, res) => {
  try {
    const maintenance = await new GetMaintenanceUsecase(
      new MongoMaintenanceRepository()
    ).execute(req.params.id);

    res.status(StatusCodes.OK).json(maintenance);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }
});
