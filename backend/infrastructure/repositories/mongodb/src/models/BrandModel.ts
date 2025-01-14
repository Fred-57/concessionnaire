import { model, Schema } from "mongoose";

export interface IBrand {
  identifier: string;
  name: string;
  logo: string;
}

export const BrandSchema = new Schema<IBrand>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
  },
  { timestamps: true }
);

export const BrandModel = model<IBrand>("Brand", BrandSchema);
