import { Router } from "express";
import { PostgresRentalRepository } from "@infrastructure/repositories/postgres";
import { ListRentalsUsecase } from "@application/usecases/rental/ListRentalsUsecase";
import { StatusCodes } from "http-status-codes";
import { Rental } from "@domain/entities/Rental";
import { CreateRentalUsecase } from "@application/usecases/rental/CreateRentalUsecase";
import { GetRentalUsecase } from "@application/usecases/rental/GetRentalUsecase";
import { DeleteRentalUsecase } from "@application/usecases/rental/DeleteRentalUsecase";
import { UpdateRentalUsecase } from "@application/usecases/rental/UpdateRentalUsecase";
import { extractCompanyId } from "src/middlewares/headerHandler";

export const RentalRouter = Router();

RentalRouter.get("/", extractCompanyId, async (req, res) => {
  let rentals;
  try {
    rentals = await new ListRentalsUsecase(
      new PostgresRentalRepository()
    ).execute(req.companyIdentifier);
  } catch {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  res.status(StatusCodes.OK).json(rentals);
});

RentalRouter.post("/", async (req, res) => {
  const {
    startDate,
    durationInMonths,
    type,
    driverIdentifier,
    motorcycleIdentifier,
  } = req.body;

  const rental = Rental.create(
    new Date(startDate),
    durationInMonths,
    type,
    driverIdentifier,
    motorcycleIdentifier
  );

  if (rental instanceof Error) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  try {
    await new CreateRentalUsecase(new PostgresRentalRepository()).execute(
      rental
    );
  } catch {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  res.sendStatus(StatusCodes.CREATED);
});

RentalRouter.get("/:identifier", async (req, res) => {
  const { identifier } = req.params;

  let rental: Rental | null = null;
  try {
    rental = await new GetRentalUsecase(new PostgresRentalRepository()).execute(
      identifier
    );
  } catch {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  res.status(StatusCodes.OK).json(rental);
});

RentalRouter.put("/:identifier", async (req, res) => {
  const { identifier } = req.params;
  const {
    startDate,
    durationInMonths,
    type,
    driverIdentifier,
    motorcycleIdentifier,
  } = req.body;

  const rental = await new GetRentalUsecase(
    new PostgresRentalRepository()
  ).execute(identifier);

  if (rental instanceof Error) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  const updatedRental = Rental.from(
    rental.identifier,
    new Date(startDate),
    durationInMonths,
    type,
    driverIdentifier,
    motorcycleIdentifier,
    rental.breakdownIdentifiers,
    rental.createdAt,
    new Date()
  );

  if (updatedRental instanceof Error) {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  try {
    await new UpdateRentalUsecase(new PostgresRentalRepository()).execute(
      updatedRental
    );
  } catch {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  res.sendStatus(StatusCodes.NO_CONTENT);
});

RentalRouter.delete("/:identifier", async (req, res) => {
  const { identifier } = req.params;

  const rental = await new GetRentalUsecase(
    new PostgresRentalRepository()
  ).execute(identifier);

  if (rental instanceof Error) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  try {
    await new DeleteRentalUsecase(new PostgresRentalRepository()).execute(
      rental
    );
  } catch {
    res.sendStatus(StatusCodes.BAD_REQUEST);
    return;
  }

  res.sendStatus(StatusCodes.NO_CONTENT);
});
