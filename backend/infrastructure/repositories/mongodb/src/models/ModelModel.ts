import { model, Schema } from "mongoose";

export interface IModel {
  identifier: string;
  name: string;
  repairMileage: number;
  repairDeadline: number;
}

export const ModelSchema = new Schema<IModel>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    repairMileage: { type: Number, required: true },
    repairDeadline: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ModelModel = model<IModel>("Model", ModelSchema);
