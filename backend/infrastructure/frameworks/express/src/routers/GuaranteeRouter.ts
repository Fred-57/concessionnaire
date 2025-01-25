import { CreateGuaranteeUsecase } from "@application/usecases/guarantee/CreateGuaranteeUsecase";
import { ListGuaranteesUsecase } from "@application/usecases/guarantee/ListGuaranteeUsecase";
import { GetGuaranteeUsecase } from "@application/usecases/guarantee/GetGuaranteeUsecase";
import { UpdateGuaranteeUsecase } from "@application/usecases/guarantee/UpdateGuaranteeUsecase";
import { DeleteGuaranteeUsecase } from "@application/usecases/guarantee/DeleteGuaranteeUsecase";
import { PostgresGuaranteeRepository } from "@infrastructure/repositories/postgres";
import { Router } from "express";
import { StatusCodes } from "http-status-codes";

export const GuaranteeRouter = Router();

GuaranteeRouter.get("/", async (_, res) => {
  const guarantees = await new ListGuaranteesUsecase(
    new PostgresGuaranteeRepository()
  ).execute();
  res.status(StatusCodes.OK).json(guarantees);
});

GuaranteeRouter.post("/", async (req, res) => {
  const guarantee = await new CreateGuaranteeUsecase(
    new PostgresGuaranteeRepository()
  ).execute(req.body);
  res.status(StatusCodes.CREATED).json(guarantee);
});

GuaranteeRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const guarantee = await new GetGuaranteeUsecase(
    new PostgresGuaranteeRepository()
  ).execute(id);
  res.status(StatusCodes.OK).json(guarantee);
});

GuaranteeRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const guarantee = await new UpdateGuaranteeUsecase(
    new PostgresGuaranteeRepository()
  ).execute({
    ...req.body,
    id,
  });
  res.status(StatusCodes.OK).json(guarantee);
});

GuaranteeRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await new DeleteGuaranteeUsecase(new PostgresGuaranteeRepository()).execute(
    id
  );
  res.status(StatusCodes.NO_CONTENT).send();
});
