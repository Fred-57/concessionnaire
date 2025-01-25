import { model, Schema } from "mongoose";

export interface ICompany {
  identifier: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CompanySchema = new Schema<ICompany>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const CompanyModel = model<ICompany>("Company", CompanySchema);
