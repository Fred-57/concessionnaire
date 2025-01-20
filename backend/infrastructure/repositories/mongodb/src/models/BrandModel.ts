import { model, Schema } from "mongoose";

export interface IBrand {
  identifier: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const BrandSchema = new Schema<IBrand>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true },
);

export const BrandModel = model<IBrand>("Brand", BrandSchema);
