import { model, Schema } from "mongoose";
import { CompanySchema, ICompany } from "./CompanyModel";

export interface IBrand {
  identifier: string;
  name: string;
  company: ICompany;
  createdAt: Date;
  updatedAt: Date;
}

export const BrandSchema = new Schema<IBrand>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    company: CompanySchema,
  },
  { timestamps: true }
);

export const BrandModel = model<IBrand>("Brand", BrandSchema);
