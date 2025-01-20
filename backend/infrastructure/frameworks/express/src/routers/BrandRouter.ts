import { ListBrandsUsecase } from "@application/usecases/brand/ListBrandsUsecase";
import { CreateBrandUsecase } from "@application/usecases/brand/CreateBrandUsecase";
import { Brand } from "@domain/entities/Brand";
import { BrandNameAlreadyTakenError } from "@domain/errors/brand/BrandNameAlreadyTakenError";
import { BrandNameTooShortError } from "@domain/errors/brand/BrandNameTooShortError";
import { PostgresBrandRepository } from "@infrastructure/repositories/postgres/";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

export const BrandRouter = Router();

BrandRouter.get("/", async (_, res) => {
  const brands = await new ListBrandsUsecase(
    new PostgresBrandRepository(),
  ).execute();
  res.status(StatusCodes.OK).json(brands);
});

BrandRouter.post("/", async (req, res) => {
  const { name } = req.body;

  const brand = Brand.create(name);

  if (brand instanceof BrandNameTooShortError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  try {
    await new CreateBrandUsecase(new PostgresBrandRepository()).execute(brand);
  } catch (error) {
    if (error instanceof BrandNameAlreadyTakenError) {
      res.sendStatus(StatusCodes.CONFLICT);
      return;
    }
  }

  res.sendStatus(StatusCodes.CREATED);
});
