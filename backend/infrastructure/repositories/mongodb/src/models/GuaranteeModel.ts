import { model, Schema } from "mongoose";
import { IPart, PartSchema } from "./PartModel";
import { IMotorcycle, MotorcycleSchema } from "./MotorcycleModel";

export interface IGuarantee {
  identifier: string;
  name: string;
  durationInMonths: number;
  coveredAmount: number;
  motorcycles: IMotorcycle[];
  parts: IPart[];
  createdAt: Date;
  updatedAt: Date;
}

export const GuaranteeSchema = new Schema<IGuarantee>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    durationInMonths: { type: Number, required: true },
    coveredAmount: { type: Number, required: true },
    motorcycles: { type: [MotorcycleSchema], required: true },
    parts: { type: [PartSchema], required: true },
  },
  { timestamps: true }
);

export const GuaranteeModel = model<IGuarantee>("Guarantee", GuaranteeSchema);
