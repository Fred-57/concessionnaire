import { Router } from "express";
import { PostgresMotorcycleRepository } from "@infrastructure/repositories/postgres";
import { ListMotorcyclesUsecase } from "@application/usecases/motorcycle/ListMotorcyclesUsecase";
import { StatusCodes } from "http-status-codes";
import { Motorcycle } from "@domain/entities/Motorcycle";
import { CreateMotorcycleUsecase } from "@application/usecases/motorcycle/CreateMotorcycleUsecase";
import { UpdateMotorcycleUsecase } from "@application/usecases/motorcycle/UpdateMotorcycleUsecase";
import { GetMotorcycleUsecase } from "@application/usecases/motorcycle/GetMotorcycleUsecase";
import { DeleteMotorcycleUsecase } from "@application/usecases/motorcycle/DeleteMotorcycleUsecase";
import { extractCompanyId } from "src/middlewares/headerHandler";

export const MotorcycleRouter = Router();

MotorcycleRouter.get("/", extractCompanyId, async (req, res) => {
  const motorcycles = await new ListMotorcyclesUsecase(
    new PostgresMotorcycleRepository()
  ).execute(req.companyIdentifier);

  res.status(StatusCodes.OK).json(motorcycles);
});

MotorcycleRouter.post("/", extractCompanyId, async (req, res) => {
  const {
    identifier,
    mileage,
    dateOfCommissioning,
    status,
    modelIdentifier,
    guaranteeIdentifier,
  } = req.body;

  const motorcycle = Motorcycle.create(
    identifier,
    mileage,
    new Date(dateOfCommissioning),
    status,
    req.companyIdentifier,
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
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  res.sendStatus(StatusCodes.CREATED);
});

MotorcycleRouter.get("/:identifier", async (req, res) => {
  const { identifier } = req.params;

  let motorcycle: Motorcycle | null = null;
  try {
    motorcycle = await new GetMotorcycleUsecase(
      new PostgresMotorcycleRepository()
    ).execute(identifier);
  } catch (error) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  res.status(StatusCodes.OK).json(motorcycle);
});

MotorcycleRouter.put("/:identifier", extractCompanyId, async (req, res) => {
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

  if (motorcycle instanceof Error) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  const updatedMotorcycle = Motorcycle.from(
    motorcycle.identifier,
    mileage,
    new Date(dateOfCommissioning),
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

  try {
    await new UpdateMotorcycleUsecase(
      new PostgresMotorcycleRepository()
    ).execute(updatedMotorcycle);
  } catch (error) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

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

  try {
    await new DeleteMotorcycleUsecase(
      new PostgresMotorcycleRepository()
    ).execute(motorcycle);
  } catch (error) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  res.sendStatus(StatusCodes.OK);
});
