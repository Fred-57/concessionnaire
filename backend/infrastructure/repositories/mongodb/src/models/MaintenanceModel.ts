import { Schema, model } from "mongoose";
import { IMotorcycle } from "./MotorcycleModel";
import { StatusMaintenanceBreakdownEnum } from "@domain/types/StatusMaintenanceBreakdownEnum";
import { IMaintenancePart } from "./MaintenancePart";

export interface IMaintenance {
  identifier: string;
  date: Date;
  recommendation: string;
  status: StatusMaintenanceBreakdownEnum;
  totalCost: number;
  motorcycle: IMotorcycle;
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
    motorcycle: {
      type: Schema.Types.ObjectId,
      ref: "Motorcycle",
      required: true,
    },
    parts: [{ type: Schema.Types.ObjectId, ref: "MaintenancePart" }],
  },
  { timestamps: true }
);

export const MaintenanceModel = model<IMaintenance>(
  "Maintenance",
  MaintenanceSchema
);
