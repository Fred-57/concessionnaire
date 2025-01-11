import { model, Schema } from "mongoose";

export interface IMotorcycle {
  identifier: string;
  mileage: number;
  dateOfCommissioning: Date;
  // TODO: Change to enum
  status: string;
}

export const MotorcycleSchema = new Schema<IMotorcycle>(
  {
    identifier: { type: String, required: true },
    mileage: { type: Number, required: true },
    dateOfCommissioning: { type: Date, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const MotorcycleModel = model<IMotorcycle>(
  "Motorcycle",
  MotorcycleSchema
);
