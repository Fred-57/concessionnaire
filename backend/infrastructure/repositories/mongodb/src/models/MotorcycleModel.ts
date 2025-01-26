import { model, Schema } from "mongoose";
import { MotorcycleStatusEnum } from "@domain/types/MotorcycleStatusEnum";

export interface IMotorcycle {
  identifier: string;
  mileage: number;
  dateOfCommissioning: Date;
  status: MotorcycleStatusEnum;
  companyIdentifier: string;
  modelIdentifier: string;
  guaranteeIdentifier?: string;
  rentalIdentifiers: string[];
  maintenanceIdentifiers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const MotorcycleSchema = new Schema<IMotorcycle>(
  {
    identifier: { type: String, required: true },
    mileage: { type: Number, required: true },
    dateOfCommissioning: { type: Date, required: true },
    status: { type: String, enum: MotorcycleStatusEnum, required: true },
    companyIdentifier: { type: String, required: true },
    modelIdentifier: { type: String, required: true },
    guaranteeIdentifier: { type: String, required: false },
    rentalIdentifiers: [{ type: String, required: false }],
    maintenanceIdentifiers: [{ type: String, required: false }],
  },
  { timestamps: true }
);

export const MotorcycleModel = model<IMotorcycle>(
  "Motorcycle",
  MotorcycleSchema
);
