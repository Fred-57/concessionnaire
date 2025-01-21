import { model, Schema } from "mongoose";
import { IRental, RentalSchema } from "./RentalModel";
import { IRepair, RepairSchema } from "./RepairModel";

export interface IBreakdown {
  identifier: string;
  date: Date;
  description: string;
  rental: IRental;
  repair: IRepair | null;
}

export const BreakdownSchema = new Schema<IBreakdown>(
  {
    identifier: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    rental: RentalSchema,
    repair: { type: RepairSchema, required: false },
  },
  { timestamps: true }
);

export const BreakdownModel = model<IBreakdown>("Breakdown", BreakdownSchema);
