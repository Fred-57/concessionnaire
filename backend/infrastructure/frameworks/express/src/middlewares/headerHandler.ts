import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

declare global {
  namespace Express {
    interface Request {
      companyIdentifier: string;
    }
  }
}

export const extractCompanyId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const companyIdentifier = req.get("Company-Identifier");

  if (!companyIdentifier) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Company-Identifier header is missing" });
    return;
  }

  req.companyIdentifier = companyIdentifier;

  next();
};
