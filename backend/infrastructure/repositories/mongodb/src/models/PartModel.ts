import { Schema, model } from "mongoose";
import { IGuaranteePart, GuaranteePartSchema } from "./GuaranteePart";
import { IBreakdownPart, BreakdownPartSchema } from "./BreakdownPart";
import { IMaintenancePart, MaintenancePartSchema } from "./MaintenancePart";

export interface IPart {
  identifier: string;
  reference: string;
  name: string;
  cost: number;
  stock: number;
  guaranteeParts: IGuaranteePart[];
  breakdownParts: IBreakdownPart[];
  maintenanceParts: IMaintenancePart[];
  createdAt: Date;
  updatedAt: Date;
}

export const PartSchema = new Schema<IPart>(
  {
    identifier: { type: String, required: true },
    reference: { type: String, required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    stock: { type: Number, required: true },
    guaranteeParts: { type: [GuaranteePartSchema], required: true },
    breakdownParts: { type: [BreakdownPartSchema], required: true },
    maintenanceParts: { type: [MaintenancePartSchema], required: true },
  },
  { timestamps: true }
);

export const PartModel = model<IPart>("Part", PartSchema);
