import { model, Schema } from "mongoose";
import { IRental } from "./RentalModel";
import { StatusMaintenanceBreakdownEnum } from "@domain/types/StatusMaintenanceBreakdownEnum";
import { IBreakdownPart } from "./BreakdownPart";

export interface IBreakdown {
  identifier: string;
  date: Date;
  description: string;
  status: StatusMaintenanceBreakdownEnum;
  totalCost: number;
  rental: IRental;
  parts: IBreakdownPart[];
  createdAt: Date;
  updatedAt: Date;
}

export const BreakdownSchema = new Schema<IBreakdown>(
  {
    identifier: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: StatusMaintenanceBreakdownEnum,
      required: true,
    },
    totalCost: { type: Number, required: true },
    rental: { type: Schema.Types.ObjectId, ref: "Rental" },
    parts: [{ type: Schema.Types.ObjectId, ref: "BreakdownPart" }],
  },
  { timestamps: true }
);

export const BreakdownModel = model<IBreakdown>("Breakdown", BreakdownSchema);
