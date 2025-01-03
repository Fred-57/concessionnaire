import type { ErrorRequestHandler } from "express";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestError } from "../helpers/error";

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  console.error(err);
  if (err instanceof RequestError) {
    if (err.message) {
      return res.status(err.status).json({ error: err.message });
    }
    return res.sendStatus(err.status);
  }

  return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
};
