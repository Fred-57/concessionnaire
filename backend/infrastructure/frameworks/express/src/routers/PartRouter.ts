import { CreatePartUsecase } from "@application/usecases/part/CreatePartUseCase";
import { GetPartUsecase } from "@application/usecases/part/GetPartUsecase";
import { ListPartsUsecase } from "@application/usecases/part/ListPartsUsecase";
import { UpdatePartUsecase } from "@application/usecases/part/UpdatePartUseCase";
import { DeletePartUsecase } from "@application/usecases/part/DeletePartUsecase";
import { Part } from "@domain/entities/Part";
import { PostgresPartRepository } from "@infrastructure/repositories/postgres/src/PostgresPartRepository";
import { PartReferenceAlreadyExistsError } from "@domain/errors/part/PartReferenceAlreadyExistsError";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { PartReferenceTooShortError } from "@domain/errors/part/PartReferenceTooShortError";
import { PartNameTooShortError } from "@domain/errors/part/PartNameTooShortError";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { CostLessThanZeroError } from "@domain/errors/CostLessThanZeroError";
import { InvalidQuantityError } from "@domain/errors/InvalidQuantityError";

export const PartRouter = Router();

PartRouter.get("/", async (_, res) => {
  const parts = await new ListPartsUsecase(
    new PostgresPartRepository()
  ).execute();
  res.status(StatusCodes.OK).json(parts);
});

PartRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const parts = await new ListPartsUsecase(
    new PostgresPartRepository()
  ).execute();

  if (!parts) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  const part = parts.find((part) => part.identifier === id);

  if (!part) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  res.status(StatusCodes.OK).json(part);
});

PartRouter.post("/", async (req, res) => {
  const { reference, name, cost, stock } = req.body;

  const part = Part.create(reference, name, cost, stock);
  if (part instanceof PartReferenceTooShortError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }
  if (part instanceof PartNameTooShortError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }
  if (part instanceof CostLessThanZeroError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }
  if (part instanceof InvalidQuantityError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }
  try {
    await new CreatePartUsecase(new PostgresPartRepository()).execute(part);
  } catch (error) {
    if (error instanceof PartReferenceAlreadyExistsError) {
      res.sendStatus(StatusCodes.CONFLICT);
      return;
    }
  }

  res.sendStatus(StatusCodes.CREATED);
});

PartRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, reference, cost, stock } = req.body;

  const part = await new GetPartUsecase(new PostgresPartRepository()).execute(
    id
  );

  if (!part) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  const updatedPart = Part.from(
    part.identifier,
    reference,
    name,
    cost,
    stock,
    part.createdAt,
    part.updatedAt
  );
  if (updatedPart instanceof PartNameTooShortError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }
  if (updatedPart instanceof PartReferenceTooShortError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  if (updatedPart instanceof PartReferenceAlreadyExistsError) {
    res.sendStatus(StatusCodes.CONFLICT);
    return;
  }

  if (updatedPart instanceof CostLessThanZeroError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  if (updatedPart instanceof InvalidQuantityError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }
  try {
    await new UpdatePartUsecase(new PostgresPartRepository()).execute(
      updatedPart
    );
  } catch (error) {
    if (error instanceof PartReferenceAlreadyExistsError) {
      res.sendStatus(StatusCodes.CONFLICT);
      return;
    }
    if (error instanceof PartNotFoundError) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }
  }

  res.sendStatus(StatusCodes.OK);
});

PartRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const part = await new GetPartUsecase(new PostgresPartRepository()).execute(
    id
  );

  if (!part) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  await new DeletePartUsecase(new PostgresPartRepository()).execute(id);

  res.sendStatus(StatusCodes.NO_CONTENT);
});
