import { model, Schema } from "mongoose";

export interface IGuarantee {
  identifier: string;
  name: string;
  // TODO: parts: IPart[];
}

export const GuaranteeSchema = new Schema<IGuarantee>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    // TODO: parts: [PartSchema],
  },
  { timestamps: true }
);

export const GuaranteeModel = model<IGuarantee>("Guarantee", GuaranteeSchema);
