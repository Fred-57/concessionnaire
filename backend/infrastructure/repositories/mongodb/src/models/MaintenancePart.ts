import { Schema, model } from "mongoose";

export interface IMaintenancePart {
  name: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export const MaintenancePartSchema = new Schema<IMaintenancePart>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export const MaintenancePartModel = model<IMaintenancePart>(
  "MaintenancePart",
  MaintenancePartSchema
);
