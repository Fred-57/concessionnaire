import { model, Schema } from "mongoose";
import { IMotorcycle } from "./MotorcycleModel";

export interface IModel {
  identifier: string;
  name: string;
  repairMileage: number;
  repairDeadline: number;
  motorcycles: IMotorcycle[];
  createdAt: Date;
  updatedAt: Date;
}

export const ModelSchema: Schema = new Schema<IModel>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    repairMileage: { type: Number, required: true },
    repairDeadline: { type: Number, required: true },
    motorcycles: [{ type: Schema.Types.ObjectId, ref: "Motorcycle" }],
  },
  { timestamps: true }
);

export const ModelModel = model<IModel>("Model", ModelSchema);
