import { Schema, model } from "mongoose";

export interface IGuaranteePart {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const GuaranteePartSchema = new Schema<IGuaranteePart>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const GuaranteePartModel = model<IGuaranteePart>(
  "GuaranteePart",
  GuaranteePartSchema
);
