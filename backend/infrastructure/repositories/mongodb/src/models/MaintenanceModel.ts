import { Schema, model } from "mongoose";
import { IMotorcycle } from "./MotorcycleModel";
import { StatusMaintenanceBreakdownEnum } from "@domain/types/StatusMaintenanceBreakdownEnum";
import { IMaintenancePart, MaintenancePartSchema } from "./MaintenancePart";

export interface IMaintenance {
  identifier: string;
  date: Date;
  recommendation: string;
  status: StatusMaintenanceBreakdownEnum;
  totalCost: number;
  motorcycleIdentifier: string;
  parts: IMaintenancePart[];
  createdAt: Date;
  updatedAt: Date;
}

export const MaintenanceSchema = new Schema<IMaintenance>(
  {
    identifier: { type: String, required: true },
    date: { type: Date, required: true },
    recommendation: { type: String, required: true },
    status: {
      type: String,
      enum: StatusMaintenanceBreakdownEnum,
      required: true,
    },
    totalCost: { type: Number, required: true },
    motorcycleIdentifier: {
      type: String,
      required: true,
    },
    parts: [{ type: MaintenancePartSchema, required: false }],
  },
  { timestamps: true }
);

export const MaintenanceModel = model<IMaintenance>(
  "Maintenance",
  MaintenanceSchema
);
