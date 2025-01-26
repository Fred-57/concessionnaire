import { CreateGuaranteeUsecase } from "@application/usecases/guarantee/CreateGuaranteeUsecase";
import { ListGuaranteesUsecase } from "@application/usecases/guarantee/ListGuaranteeUsecase";
import { GetGuaranteeUsecase } from "@application/usecases/guarantee/GetGuaranteeUsecase";
import { UpdateGuaranteeUsecase } from "@application/usecases/guarantee/UpdateGuaranteeUsecase";
import { DeleteGuaranteeUsecase } from "@application/usecases/guarantee/DeleteGuaranteeUsecase";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Guarantee } from "@domain/entities/Guarantee";
import { GuaranteeNotFoundError } from "@domain/errors/guarantee/GuaranteeNotFoundError";
// import { MongoGuaranteeRepository } from "@infrastructure/repositories/mongodb";
// import {
//   MongoPartRepository,
// } from "@infrastructure/repositories/mongodb";
import { PostgresPartRepository } from "@infrastructure/repositories/postgres";
import { PostgresGuaranteeRepository } from "@infrastructure/repositories/postgres";
import { MongoPartRepository } from "@infrastructure/repositories/mongodb";

export const GuaranteeRouter = Router();

GuaranteeRouter.get("/", async (_, res) => {
  try {
    const guarantees = await new ListGuaranteesUsecase(
      new PostgresGuaranteeRepository()
    ).execute();
    res.status(StatusCodes.OK).json(guarantees);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }
});

GuaranteeRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      durationInMonths,
      coveredAmount,
      partsIdentifiers,
      motorcyclesIdentifiers,
    } = req.body;

    const guarantee = Guarantee.create(
      name,
      durationInMonths,
      coveredAmount,
      partsIdentifiers,
      motorcyclesIdentifiers
    );

    if (guarantee instanceof Error) {
      res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
    }

    await new CreateGuaranteeUsecase(
      new PostgresGuaranteeRepository(),
      new PostgresPartRepository()
    ).execute(guarantee);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }

  res.sendStatus(StatusCodes.CREATED);
});

GuaranteeRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const guarantee = await new GetGuaranteeUsecase(
      new PostgresGuaranteeRepository()
    ).execute(id);

    if (guarantee instanceof GuaranteeNotFoundError) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }

    res.status(StatusCodes.OK).json(guarantee);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }
});

GuaranteeRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    durationInMonths,
    coveredAmount,
    partsIdentifiers,
    motorcyclesIdentifiers,
  } = req.body;

  try {
    const guarantee = await new GetGuaranteeUsecase(
      new PostgresGuaranteeRepository()
    ).execute(id);

    const updatedGuarantee = Guarantee.from(
      id,
      name,
      durationInMonths,
      coveredAmount,
      partsIdentifiers,
      motorcyclesIdentifiers,
      guarantee.createdAt,
      new Date()
    );

    if (updatedGuarantee instanceof Error) {
      res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
    }

    await new UpdateGuaranteeUsecase(
      new PostgresGuaranteeRepository(),
      new PostgresPartRepository()
    ).execute(updatedGuarantee);

    res.sendStatus(StatusCodes.OK);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }
});

GuaranteeRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await new DeleteGuaranteeUsecase(new PostgresGuaranteeRepository()).execute(
      id
    );
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }
  res.status(StatusCodes.NO_CONTENT).send();
});
