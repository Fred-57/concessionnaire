import { model, Schema } from "mongoose";
import { DriverSchema, IDriver } from "./DriverModel";
import { IMotorcycle, MotorcycleSchema } from "./MotorcycleModel";

export interface IRental {
  identifier: string;
  startDate: Date;
  durationInMonths: number;
  driver: IDriver;
  motorcycle: IMotorcycle;
}

export const RentalSchema = new Schema<IRental>(
  {
    identifier: { type: String, required: true },
    startDate: { type: Date, required: true },
    durationInMonths: { type: Number, required: true },
    driver: DriverSchema,
    motorcycle: MotorcycleSchema,
  },
  { timestamps: true }
);

export const RentalModel = model<IRental>("Rental", RentalSchema);
