import { model, Schema } from "mongoose";
import { CompanyTypeEnum } from "@domain/types/CompanyTypeEnum";
import { IDriver } from "./DriverModel";
import { IMotorcycle } from "./MotorcycleModel";

export interface ICompany {
  identifier: string;
  name: string;
  type: CompanyTypeEnum;
  drivers: IDriver[];
  motorcycles: IMotorcycle[];
  createdAt: Date;
  updatedAt: Date;
}

export const CompanySchema = new Schema<ICompany>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: CompanyTypeEnum, required: true },
    drivers: [{ type: Schema.Types.ObjectId, ref: "Driver" }],
    motorcycles: [{ type: Schema.Types.ObjectId, ref: "Motorcycle" }],
  },
  { timestamps: true }
);

export const CompanyModel = model<ICompany>("Company", CompanySchema);
