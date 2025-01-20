import { CreateBrandUsecase } from "@application/usecases/brand/CreateBrandUsecase";
import { DeleteBrandUsecase } from "@application/usecases/brand/DeleteBrandUsecase";
import { GetBrandUsecase } from "@application/usecases/brand/GetBrandUsecase";
import { ListBrandsUsecase } from "@application/usecases/brand/ListBrandsUsecase";
import { UpdateBrandUsecase } from "@application/usecases/brand/UpdateBrandUsecase";
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

BrandRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const brands = await new ListBrandsUsecase(
    new PostgresBrandRepository(),
  ).execute();

  if (!brands) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  const brand = brands.find((brand) => brand.identifier === id);

  if (!brand) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  res.status(StatusCodes.OK).json(brand);
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

BrandRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await new GetBrandUsecase(
    new PostgresBrandRepository(),
  ).execute(id);

  if (!brand) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  const updatedBrand = Brand.from(
    brand.identifier,
    name,
    brand.createdAt,
    brand.updatedAt,
  );

  if (updatedBrand instanceof BrandNameTooShortError) {
    res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    return;
  }

  try {
    await new UpdateBrandUsecase(new PostgresBrandRepository()).execute(
      updatedBrand,
    );
  } catch (error) {
    if (error instanceof BrandNameAlreadyTakenError) {
      res.sendStatus(StatusCodes.CONFLICT);
      return;
    }
  }

  res.sendStatus(StatusCodes.OK);
});

BrandRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const brand = await new GetBrandUsecase(
    new PostgresBrandRepository(),
  ).execute(id);

  if (!brand) {
    res.sendStatus(StatusCodes.NOT_FOUND);
    return;
  }

  await new DeleteBrandUsecase(new PostgresBrandRepository()).execute(id);

  res.sendStatus(StatusCodes.NO_CONTENT);
});
