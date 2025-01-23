import { Schema, model } from "mongoose";

export interface IPart {
  identifier: string;
  reference: string;
  name: string;
  cost: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export const PartSchema = new Schema<IPart>(
  {
    identifier: { type: String, required: true },
    reference: { type: String, required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);

export const PartModel = model<IPart>("Part", PartSchema);
