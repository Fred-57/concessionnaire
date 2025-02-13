import { Schema, model } from "mongoose";
import { IRental } from "./RentalModel";

export interface IDriver {
  identifier: string;
  name: string;
  license: string;
  numberOfYearsOfExperience: number;
  companyIdentifier: string;
  rentals: IRental[];
  createdAt: Date;
  updatedAt: Date;
}

export const DriverSchema = new Schema<IDriver>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    license: { type: String, required: true },
    numberOfYearsOfExperience: { type: Number, required: true },
    companyIdentifier: { type: String, required: true },
    rentals: [{ type: Schema.Types.ObjectId, ref: "Rental" }],
  },
  { timestamps: true }
);

export const DriverModel = model<IDriver>("Driver", DriverSchema);
