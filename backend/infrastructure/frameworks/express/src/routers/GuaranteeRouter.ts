import { CreateGuaranteeUsecase } from "@application/usecases/guarantee/CreateGuaranteeUsecase";
import { ListGuaranteesUsecase } from "@application/usecases/guarantee/ListGuaranteeUsecase";
import { GetGuaranteeUsecase } from "@application/usecases/guarantee/GetGuaranteeUsecase";
import { UpdateGuaranteeUsecase } from "@application/usecases/guarantee/UpdateGuaranteeUsecase";
import { DeleteGuaranteeUsecase } from "@application/usecases/guarantee/DeleteGuaranteeUsecase";
import { PostgresGuaranteeRepository } from "@infrastructure/repositories/postgres";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { GuaranteeNameAlreadyTakenError } from "@domain/errors/guarantee/GuaranteeNameAlreadyTakenError";
import { Guarantee } from "@domain/entities/Guarantee";
import { GuaranteeNotFoundError } from "@domain/errors/guarantee/GuaranteeNotFoundError";

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
  const { name, durationInMonths, coveredAmount, parts } = req.body;

  const guarantee = Guarantee.create(
    name,
    durationInMonths,
    coveredAmount,
    parts
  );

  if (guarantee instanceof Error) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  try {
    await new CreateGuaranteeUsecase(new PostgresGuaranteeRepository()).execute(
      guarantee
    );
  } catch (error) {
    if (error instanceof GuaranteeNameAlreadyTakenError) {
      res.sendStatus(StatusCodes.CONFLICT);
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
  const { name, durationInMonths, coveredAmount, parts } = req.body;

  try {
    const guarantee = await new GetGuaranteeUsecase(
      new PostgresGuaranteeRepository()
    ).execute(id);

    const updatedGuarantee = Guarantee.from(
      id,
      name,
      durationInMonths,
      coveredAmount,
      parts,
      guarantee.createdAt,
      new Date()
    );

    if (updatedGuarantee instanceof Error) {
      res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
    }

    await new UpdateGuaranteeUsecase(new PostgresGuaranteeRepository()).execute(
      updatedGuarantee
    );

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
