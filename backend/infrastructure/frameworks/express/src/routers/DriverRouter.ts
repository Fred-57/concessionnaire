import { CreateDriverUsecase } from "@application/usecases/driver/CreateDriverUsecase";
import { DeleteDriverUsecase } from "@application/usecases/driver/DeleteDriverUsecase";
import { GetDriverUsecase } from "@application/usecases/driver/GetDriverUsecase";
import { ListDriversByCompanyUsecase } from "@application/usecases/driver/ListDriversByCompanyUsecase";
import { UpdateDriverUsecase } from "@application/usecases/driver/UpdateDriverUsecase";
import { Driver } from "@domain/entities/Driver";
import { DriverNameTooShortError } from "@domain/errors/driver/DriverNameTooShortError";
import {
  PostgresCompanyRepository,
  PostgresDriverRepository,
} from "@infrastructure/repositories/postgres";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

export const DriverRouter = Router();

DriverRouter.get("/", async (req, res) => {
  const companyIdentifierHeader = req.get("companyId");

  if (!companyIdentifierHeader) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "companyId header is missing" });
    return;
  }

  try {
    const drivers = await new ListDriversByCompanyUsecase(
      new PostgresDriverRepository(),
      new PostgresCompanyRepository()
    ).execute(companyIdentifierHeader);
    res.status(StatusCodes.OK).json(drivers);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.NOT_FOUND).send(error.name);
      return;
    }
  }
});

DriverRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await new GetDriverUsecase(
      new PostgresDriverRepository()
    ).execute(id);
    res.status(StatusCodes.OK).json(driver);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.NOT_FOUND).send(error.name);
      return;
    }
  }
});

DriverRouter.post("/", async (req, res) => {
  const companyIdentifierHeader = req.get("companyId");

  if (!companyIdentifierHeader) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "companyId header is missing" });
    return;
  }

  const { name, license, numberOfYearsOfExperience, companyIdentifier } =
    req.body;

  const driver = Driver.create(
    name,
    license,
    numberOfYearsOfExperience,
    companyIdentifier
  );

  if (driver instanceof DriverNameTooShortError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  try {
    await new CreateDriverUsecase(
      new PostgresDriverRepository(),
      new PostgresCompanyRepository()
    ).execute(driver, companyIdentifierHeader);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }

  res.sendStatus(StatusCodes.CREATED);
});

DriverRouter.put("/:id", async (req, res) => {
  const companyIdentifierHeader = req.get("companyId");

  if (!companyIdentifierHeader) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "companyId header is missing" });
    return;
  }

  const { id } = req.params;
  const { name, license, numberOfYearsOfExperience, companyIdentifier } =
    req.body;

  try {
    const driver = await new GetDriverUsecase(
      new PostgresDriverRepository()
    ).execute(id);

    const updatedDriver = Driver.from(
      id,
      name,
      license,
      numberOfYearsOfExperience,
      companyIdentifier,
      driver.createdAt,
      new Date()
    );

    if (updatedDriver instanceof DriverNameTooShortError) {
      res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
      return;
    }

    await new UpdateDriverUsecase(
      new PostgresDriverRepository(),
      new PostgresCompanyRepository()
    ).execute(updatedDriver, companyIdentifierHeader);
  } catch (error) {
    if (error instanceof Error) {
      res.status(StatusCodes.CONFLICT).send(error.name);
      return;
    }
  }

  res.sendStatus(StatusCodes.OK);
});

DriverRouter.delete("/:id", async (req, res) => {
  const companyIdentifierHeader = req.get("companyId");

  if (!companyIdentifierHeader) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "companyId header is missing" });
    return;
  }

  const { id } = req.params;

  try {
    await new DeleteDriverUsecase(
      new PostgresDriverRepository(),
      new PostgresCompanyRepository()
    ).execute(id, companyIdentifierHeader);

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    if (error instanceof Error) {
      res.sendStatus(StatusCodes.NOT_FOUND);
    }
  }
});
