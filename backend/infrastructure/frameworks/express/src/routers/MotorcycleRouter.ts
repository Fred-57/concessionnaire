import { Router } from "express";
import { PostgresMotorcycleRepository } from "@infrastructure/repositories/postgres";
import { ListMotorcyclesUsecase } from "@application/usecases/motorcycle/ListMotorcyclesUsecase";
import { StatusCodes } from "http-status-codes";
import { Motorcycle } from "@domain/entities/Motorcycle";
import { CreateMotorcycleUsecase } from "@application/usecases/motorcycle/CreateMotorcycleUsecase";
import { UpdateMotorcycleUsecase } from "@application/usecases/motorcycle/UpdateMotorcycleUsecase";
import { GetMotorcycleUsecase } from "@application/usecases/motorcycle/GetMotorcycleUsecase";
import { DeleteMotorcycleUsecase } from "@application/usecases/motorcycle/DeleteMotorcycleUsecase";

export const MotorcycleRouter = Router();

MotorcycleRouter.get("/", async (req, res) => {
  const companyIdentifier = req.headers["company-identifier"] as string;

  const motorcycles = await new ListMotorcyclesUsecase(
    new PostgresMotorcycleRepository()
  ).execute(companyIdentifier);

  res.status(StatusCodes.OK).json(motorcycles);
});

MotorcycleRouter.post("/", async (req, res) => {
  const {
    identifier,
    mileage,
    dateOfCommissioning,
    status,
    companyIdentifier,
    modelIdentifier,
    guaranteeIdentifier,
  } = req.body;

  const motorcycle = Motorcycle.create(
    identifier,
    mileage,
    dateOfCommissioning,
    status,
    companyIdentifier,
    modelIdentifier,
    guaranteeIdentifier ?? null,
    [],
    []
  );

  if (motorcycle instanceof Error) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  try {
    await new CreateMotorcycleUsecase(
      new PostgresMotorcycleRepository()
    ).execute(motorcycle);
  } catch (error) {
    res.sendStatus(StatusCodes.CONFLICT);
    return;
  }

  res.sendStatus(StatusCodes.CREATED);
});

MotorcycleRouter.get("/:identifier", async (req, res) => {
  const { identifier } = req.params;

  const motorcycle = await new GetMotorcycleUsecase(
    new PostgresMotorcycleRepository()
  ).execute(identifier);

  res.status(StatusCodes.OK).json(motorcycle);
});

MotorcycleRouter.put("/:identifier", async (req, res) => {
  const { identifier } = req.params;
  const {
    mileage,
    dateOfCommissioning,
    status,
    modelIdentifier,
    guaranteeIdentifier,
  } = req.body;

  const motorcycle = await new GetMotorcycleUsecase(
    new PostgresMotorcycleRepository()
  ).execute(identifier);

  const updatedMotorcycle = Motorcycle.from(
    motorcycle.identifier,
    mileage,
    dateOfCommissioning,
    status,
    motorcycle.companyIdentifier,
    modelIdentifier,
    guaranteeIdentifier,
    motorcycle.rentalIdentifiers,
    motorcycle.maintenanceIdentifiers,
    motorcycle.createdAt,
    new Date()
  );

  if (updatedMotorcycle instanceof Error) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  await new UpdateMotorcycleUsecase(new PostgresMotorcycleRepository()).execute(
    motorcycle
  );

  res.sendStatus(StatusCodes.OK);
});

MotorcycleRouter.delete("/:identifier", async (req, res) => {
  const { identifier } = req.params;

  const motorcycle = await new GetMotorcycleUsecase(
    new PostgresMotorcycleRepository()
  ).execute(identifier);

  if (motorcycle instanceof Error) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  await new DeleteMotorcycleUsecase(new PostgresMotorcycleRepository()).execute(
    motorcycle
  );

  res.sendStatus(StatusCodes.OK);
});
