import { Schema, model } from "mongoose";
import { IMotorcycle } from "./MotorcycleModel";
import { IRepair } from "./RepairModel";
import { StatusMaintenance } from "@domain/types/StatusMaintenance";

export interface IMaintenance {
  identifier: string;
  date: Date;
  motorcycle: IMotorcycle;
  repair: IRepair | null;
  recommendation: string;
  status: StatusMaintenance;
}

export const MaintenanceSchema = new Schema<IMaintenance>(
  {
    identifier: { type: String, required: true },
    date: { type: Date, required: true },
    motorcycle: {
      type: Schema.Types.ObjectId,
      ref: "Motorcycle",
      required: true,
    },
    repair: { type: Schema.Types.ObjectId, ref: "Repair", required: false },
    recommendation: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const MaintenanceModel = model<IMaintenance>(
  "Maintenance",
  MaintenanceSchema
);
