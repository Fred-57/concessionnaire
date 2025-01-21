import { Schema, model } from "mongoose";
import { IPart, PartSchema } from "./PartModel";
import { StatusRepair } from "@domain/types/StatusRepair";

export interface IRepair {
  identifier: string;
  date: Date;
  replacedParts: IPart[];
  cost: number;
  status: StatusRepair;
  createdAt: Date;
  updatedAt: Date;
}

export const RepairSchema = new Schema<IRepair>(
  {
    identifier: { type: String, required: true },
    date: { type: Date, required: true },
    replacedParts: { type: [PartSchema], required: true },
    cost: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const RepairModel = model<IRepair>("Repair", RepairSchema);
