import { Router } from "express";
import { CreatePartOrderHistoryUsecase } from "@application/usecases/partOrderHistory/CreatePartOrderHistoryUsecase";
import { GetPartOrderHistoryUsecase } from "@application/usecases/partOrderHistory/GetPartOrderHistoryUsecase";
import { ListPartOrderHistoryUsecase } from "@application/usecases/partOrderHistory/ListPartOrderHistoryUsecase";
import { UpdatePartOrderHistoryUsecase } from "@application/usecases/partOrderHistory/UpdatePartOrderHistoryUsecase";
import { DeletePartOrderHistoryUsecase } from "@application/usecases/partOrderHistory/DeletePartOrderHistoryUsecase";
import { PostgresPartOrderHistoryRepository } from "@infrastructure/repositories/postgres/src/PostgresPartOrderHistoryRepository";
import { PartOrderHistory } from "@domain/entities/PartOrderHistory";
import { PartOrderHistoryStatusEnum } from "@domain/types/PartOrderHistoryStatusEnum";
import { StatusCodes } from "http-status-codes";
import { PostgresPartRepository } from "@infrastructure/repositories/postgres/src/PostgresPartRepository";

export const PartOrderHistoryRouter = Router();
export const repository = new PostgresPartOrderHistoryRepository();
export const partRepository = new PostgresPartRepository();

PartOrderHistoryRouter.get("/", async (req, res) => {
  try {
    const partOrderHistory = await new ListPartOrderHistoryUsecase(
      repository
    ).execute();
    res.status(StatusCodes.OK).json(partOrderHistory);
  } catch (error) {
    console.error(error);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

PartOrderHistoryRouter.post("/", async (req, res) => {
  const { date, quantity, partIdentifier } = req.body;

  const partOrderHistory = PartOrderHistory.create(
    new Date(date),
    partIdentifier,
    quantity
  );

  if (partOrderHistory instanceof Error) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  try {
    await new CreatePartOrderHistoryUsecase(repository, partRepository).execute(
      partOrderHistory
    );
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.BAD_REQUEST).send(error.name);
      return;
    }
  }

  res.sendStatus(StatusCodes.CREATED);
});

PartOrderHistoryRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const partOrderHistory = await new GetPartOrderHistoryUsecase(
      repository
    ).execute(id);

    if (!partOrderHistory) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }

    res.status(StatusCodes.OK).json(partOrderHistory);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    return;
  }
});

PartOrderHistoryRouter.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const partOrderHistory = await new GetPartOrderHistoryUsecase(
      repository
    ).execute(id);

    if (!partOrderHistory) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }

    const updatedPartOrderHistory = PartOrderHistory.from(
      partOrderHistory.identifier,
      partOrderHistory.date.value,
      partOrderHistory.quantity.value,
      partOrderHistory.cost,
      status as PartOrderHistoryStatusEnum,
      partOrderHistory.partIdentifier.value,
      partOrderHistory.createdAt,
      partOrderHistory.updatedAt
    );

    if (updatedPartOrderHistory instanceof Error) {
      res.status(StatusCodes.BAD_REQUEST).send(updatedPartOrderHistory.message);
      return;
    }

    await new UpdatePartOrderHistoryUsecase(repository, partRepository).execute(
      updatedPartOrderHistory
    );
    res.sendStatus(StatusCodes.OK);
  } catch (error) {
    console.error(error);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});

PartOrderHistoryRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const partOrderHistory = await new GetPartOrderHistoryUsecase(
      repository
    ).execute(id);

    if (!partOrderHistory) {
      res.sendStatus(StatusCodes.NOT_FOUND);
      return;
    }

    await new DeletePartOrderHistoryUsecase(repository).execute(
      partOrderHistory
    );
    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
});
