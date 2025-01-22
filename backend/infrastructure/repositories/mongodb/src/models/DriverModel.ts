import { Schema, model } from "mongoose";

export interface IDriver {
  identifier: string;
  name: string;
  license: string;
  numberOfYearsOfExperience: number;
  createdAt: Date;
  updatedAt: Date;
}

export const DriverSchema = new Schema<IDriver>(
  {
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    license: { type: String, required: true },
    numberOfYearsOfExperience: { type: Number, required: true },
  },
  { timestamps: true },
);

export const DriverModel = model<IDriver>("Driver", DriverSchema);
