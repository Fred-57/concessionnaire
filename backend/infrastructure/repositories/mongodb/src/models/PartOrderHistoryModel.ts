import { Schema, model } from "mongoose";

export interface IPartOrderHistory {
  date: Date;
  quantity: number;
  cost: number;
  status: string;
  partId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PartOrderHistorySchema = new Schema<IPartOrderHistory>(
  {
    date: { type: Date, required: true },
    quantity: { type: Number, required: true },
    cost: { type: Number, required: true },
    status: { type: String, required: true },
    partId: { type: String, required: true },
  },
  { timestamps: true }
);

export const PartOrderHistoryModel = model<IPartOrderHistory>(
  "PartOrderHistory",
  PartOrderHistorySchema
);
