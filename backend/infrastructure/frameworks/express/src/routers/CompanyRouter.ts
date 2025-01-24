import { CreateCompanyUsecase } from "@application/usecases/company/CreateCompanyUsecase";
import { DeleteCompanyUsecase } from "@application/usecases/company/DeleteCompanyUsecase";
import { GetCompanyUsecase } from "@application/usecases/company/GetCompanyUsecase";
import { ListCompaniesUsecase } from "@application/usecases/company/ListCompaniesUsecase";
import { UpdateCompanyUsecase } from "@application/usecases/company/UpdateCompanyUsecase";
import { Company } from "@domain/entities/Company";
import { CompanyNameAlreadyTakenError } from "@domain/errors/company/CompanyNameAlreadyTakenError";
import { CompanyNameTooShortError } from "@domain/errors/company/CompanyNameTooShortError";
import { PostgresCompanyRepository } from "@infrastructure/repositories/postgres";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

export const CompanyRouter = Router();

CompanyRouter.get("/", async (_, res) => {
  const companies = await new ListCompaniesUsecase(
    new PostgresCompanyRepository()
  ).execute();
  res.status(StatusCodes.OK).json(companies);
});

CompanyRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const companies = await new ListCompaniesUsecase(
    new PostgresCompanyRepository()
  ).execute();

  if (!companies) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  const company = companies.find((company) => company.identifier === id);

  if (!company) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  res.status(StatusCodes.OK).json(company);
});

CompanyRouter.post("/", async (req, res) => {
  const { name } = req.body;

  const company = Company.create(name);

  if (company instanceof CompanyNameTooShortError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  try {
    await new CreateCompanyUsecase(new PostgresCompanyRepository()).execute(
      company
    );
  } catch (error) {
    if (error instanceof CompanyNameAlreadyTakenError) {
      res.sendStatus(StatusCodes.CONFLICT);
      return;
    }
  }

  res.sendStatus(StatusCodes.CREATED);
});

CompanyRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const company = await new GetCompanyUsecase(
    new PostgresCompanyRepository()
  ).execute(id);

  if (!company) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  const updatedCompany = Company.from(
    company.identifier,
    name,
    company.createdAt,
    company.updatedAt
  );

  if (updatedCompany instanceof CompanyNameTooShortError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  try {
    await new UpdateCompanyUsecase(new PostgresCompanyRepository()).execute(
      updatedCompany
    );
  } catch (error) {
    if (error instanceof CompanyNameAlreadyTakenError) {
      res.sendStatus(StatusCodes.CONFLICT);
      return;
    }
  }

  res.sendStatus(StatusCodes.OK);
});

CompanyRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const company = await new GetCompanyUsecase(
    new PostgresCompanyRepository()
  ).execute(id);

  if (!company) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  await new DeleteCompanyUsecase(new PostgresCompanyRepository()).execute(id);

  res.sendStatus(StatusCodes.NO_CONTENT);
});
