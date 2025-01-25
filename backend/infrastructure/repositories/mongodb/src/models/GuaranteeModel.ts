import { model, Schema } from "mongoose";

export interface IGuarantee {
  identifier: string;
  name: string;
  durationInMonths: number;
  coveredAmount: number;
  motorcyclesId: string[] | null;
  partsId: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const GuaranteeSchema = new Schema<IGuarantee>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    durationInMonths: { type: Number, required: true },
    coveredAmount: { type: Number, required: true },
    motorcyclesId: { type: [String], required: false },
    partsId: { type: [String], required: true },
  },
  { timestamps: true }
);

export const GuaranteeModel = model<IGuarantee>("Guarantee", GuaranteeSchema);
