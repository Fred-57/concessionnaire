import { model, Schema } from "mongoose";
import { IPart, PartSchema } from "./PartModel";

export interface IGuarantee {
  identifier: string;
  name: string;
  parts: IPart[];
}

export const GuaranteeSchema = new Schema<IGuarantee>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    parts: { type: [PartSchema], required: true },
  },
  { timestamps: true }
);

export const GuaranteeModel = model<IGuarantee>("Guarantee", GuaranteeSchema);
