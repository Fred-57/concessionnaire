import { model, Schema } from "mongoose";
import { IRental, RentalSchema } from "./RentalModel";

export interface IBreakdown {
  identifier: string;
  date: Date;
  description: string;
  rental: IRental;
}

export const BreakdownSchema = new Schema<IBreakdown>(
  {
    identifier: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    rental: RentalSchema,
  },
  { timestamps: true }
);

export const BreakdownModel = model<IBreakdown>("Breakdown", BreakdownSchema);
