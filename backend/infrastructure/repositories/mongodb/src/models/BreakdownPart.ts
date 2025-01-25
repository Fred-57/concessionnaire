import { Schema, model } from "mongoose";

export interface IBreakdownPart {
  name: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export const BreakdownPartSchema = new Schema<IBreakdownPart>(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export const BreakdownPartModel = model<IBreakdownPart>(
  "BreakdownPart",
  BreakdownPartSchema
);
