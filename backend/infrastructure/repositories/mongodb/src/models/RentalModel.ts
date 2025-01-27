import { model, Schema } from "mongoose";
import { RentalTypeEnum } from "@domain/types/RentalTypeEnum";

export interface IRental {
  identifier: string;
  startDate: Date;
  durationInMonths: number;
  type: RentalTypeEnum;
  driverIdentifier: string;
  motorcycleIdentifier: string;
  breakdownIdentifiers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const RentalSchema = new Schema<IRental>(
  {
    identifier: { type: String, required: true },
    startDate: { type: Date, required: true },
    durationInMonths: { type: Number, required: true },
    type: { type: String, enum: RentalTypeEnum, required: true },
    driverIdentifier: { type: String, required: true },
    motorcycleIdentifier: { type: String, required: true },
    breakdownIdentifiers: { type: [String], required: true },
  },
  { timestamps: true }
);

export const RentalModel = model<IRental>("Rental", RentalSchema);
