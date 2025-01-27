import { Schema, model } from "mongoose";
import { PartSchema } from "./PartModel";
import { IPart } from "./PartModel";

export interface IMaintenancePart {
  part: IPart;
  quantity: number;
}

export const MaintenancePartSchema = new Schema<IMaintenancePart>(
  {
    part: { type: PartSchema, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export const MaintenancePartModel = model<IMaintenancePart>(
  "MaintenancePart",
  MaintenancePartSchema
);
