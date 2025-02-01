import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import {
  PostgresBreakdownRepository,
  PostgresPartRepository,
} from "@infrastructure/repositories/postgres";
import { ListBreakdownsUseCase } from "@application/usecases/breakdown/ListBreakdownsUsecase";
import { ListBreakdownsByRentalUseCase } from "@application/usecases/breakdown/ListBreakdownsByRentalUsecase";
import { PostgresRentalRepository } from "@infrastructure/repositories/postgres";
import { RentalNotFoundError } from "@domain/errors/rental/RentalNotFoundError";
import { BreakdownNotFoundError } from "@domain/errors/breakdown/BreakdownNotFoundError";
import { GetBreakdownUsecase } from "@application/usecases/breakdown/GetBreakdownUsecase";
import { Breakdown } from "@domain/entities/Breakdown";
import { DateBehindNowError } from "@domain/errors/DateBehindNowError";
import { BreakdownTotalCostLessThanZeroError } from "@domain/errors/breakdown/BreakdownTotalCostLessThanZero";
import { CreateBreakdownUsecase } from "@application/usecases/breakdown/CreateBreakdownUsecase";
import { UpdateBreakdownUsecase } from "@application/usecases/breakdown/UpdateBreakdownUsecase";
import { DeleteBreakdownUsecase } from "@application/usecases/breakdown/DeleteBreakdownUsecase";

export const BreakdownRouter = Router();

BreakdownRouter.get("/", async (req, res) => {
  const breakdowns = await new ListBreakdownsUseCase(
    new PostgresBreakdownRepository()
  ).execute();

  res.status(StatusCodes.OK).json(breakdowns);
});

BreakdownRouter.get("/rental/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const breakdowns = await new ListBreakdownsByRentalUseCase(
      new PostgresBreakdownRepository(),
      new PostgresRentalRepository()
    ).execute(id);

    res.status(StatusCodes.OK).json(breakdowns);
  } catch (error) {
    if (error instanceof RentalNotFoundError) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }
  }
});

BreakdownRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const breakdown = await new GetBreakdownUsecase(
      new PostgresBreakdownRepository()
    ).execute(id);

    res.status(StatusCodes.OK).json(breakdown);
  } catch (error) {
    if (error instanceof BreakdownNotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send(error.name);
      return;
    }
  }
});

BreakdownRouter.post("/", async (req, res) => {
  const { date, description, rentalIdentifier, parts, status } = req.body;

  const breakdown = Breakdown.create(
    date,
    description,
    rentalIdentifier,
    parts,
    status
  );

  if (
    breakdown instanceof BreakdownTotalCostLessThanZeroError ||
    breakdown instanceof DateBehindNowError
  ) {
    res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(breakdown.name);
    return;
  }

  try {
    await new CreateBreakdownUsecase(
      new PostgresBreakdownRepository(),
      new PostgresPartRepository()
    ).execute(breakdown);
  } catch (error) {
    if (error instanceof BreakdownNotFoundError) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }

  res.sendStatus(StatusCodes.CREATED);
});

BreakdownRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { date, description, rentalIdentifier, parts, status } = req.body;

  try {
    const breakdown = await new GetBreakdownUsecase(
      new PostgresBreakdownRepository()
    ).execute(id);

    const updatedBreakdown = Breakdown.from(
      breakdown.identifier,
      date,
      description,
      rentalIdentifier,
      parts,
      status,
      breakdown.createdAt,
      new Date()
    );

    if (
      updatedBreakdown instanceof BreakdownTotalCostLessThanZeroError ||
      updatedBreakdown instanceof DateBehindNowError
    ) {
      res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(updatedBreakdown.name);
      return;
    }

    await new UpdateBreakdownUsecase(
      new PostgresBreakdownRepository(),
      new PostgresPartRepository()
    ).execute(updatedBreakdown);
  } catch (error) {
    if (error instanceof BreakdownNotFoundError) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }

  res.sendStatus(StatusCodes.OK);
});

BreakdownRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await new DeleteBreakdownUsecase(new PostgresBreakdownRepository()).execute(
      id
    );
  } catch (error) {
    if (error instanceof BreakdownNotFoundError) {
      res.status(StatusCodes.NOT_FOUND).send(error.name);
      return;
    }
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }

  res.sendStatus(StatusCodes.OK);
});
