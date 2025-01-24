import { model, Schema } from "mongoose";
import { BrandSchema, IBrand } from "./BrandModel";

export interface IModel {
  identifier: string;
  name: string;
  repairMileage: number;
  repairDeadline: number;
  brand: IBrand;
  createdAt: Date;
  updatedAt: Date;
}

export const ModelSchema = new Schema<IModel>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    repairMileage: { type: Number, required: true },
    repairDeadline: { type: Number, required: true },
    brand: BrandSchema,
  },
  { timestamps: true }
);

export const ModelModel = model<IModel>("Model", ModelSchema);
