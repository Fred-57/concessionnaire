import { model, Schema } from "mongoose";
import { IDriver } from "./DriverModel";
import { IMotorcycle } from "./MotorcycleModel";
import { IBreakdown } from "./BreakdownModel";
import { RentalTypeEnum } from "@domain/types/RentalTypeEnum";

export interface IRental {
  identifier: string;
  startDate: Date;
  durationInMonths: number;
  type: RentalTypeEnum;
  driver: IDriver;
  motorcycle: IMotorcycle;
  breakdowns: IBreakdown[];
  createdAt: Date;
  updatedAt: Date;
}

export const RentalSchema = new Schema<IRental>(
  {
    identifier: { type: String, required: true },
    startDate: { type: Date, required: true },
    durationInMonths: { type: Number, required: true },
    type: { type: String, enum: RentalTypeEnum, required: true },
    driver: { type: Schema.Types.ObjectId, ref: "Driver" },
    motorcycle: { type: Schema.Types.ObjectId, ref: "Motorcycle" },
    breakdowns: [{ type: Schema.Types.ObjectId, ref: "Breakdown" }],
  },
  { timestamps: true }
);

export const RentalModel = model<IRental>("Rental", RentalSchema);
