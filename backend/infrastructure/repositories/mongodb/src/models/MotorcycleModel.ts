import { model, Schema } from "mongoose";
import { IModel, ModelSchema } from "./ModelModel";
import { MotorcycleStatusEnum } from "@domain/types/MotorcycleStatusEnum";

// export enum MotorcycleStatus {
//   Rented = "Rented",
//   Available = "Available",
//   InRepair = "InRepair",
//   InMaintenance = "InMaintenance",
// }

export interface IMotorcycle {
  identifier: string;
  mileage: number;
  dateOfCommissioning: Date;
  // TODO: Change to enum
  status: MotorcycleStatusEnum;
  model: IModel;
}

export const MotorcycleSchema = new Schema<IMotorcycle>(
  {
    identifier: { type: String, required: true },
    mileage: { type: Number, required: true },
    dateOfCommissioning: { type: Date, required: true },
    status: { type: String, enum: MotorcycleStatusEnum, required: true },
    model: ModelSchema,
  },
  { timestamps: true }
);

export const MotorcycleModel = model<IMotorcycle>(
  "Motorcycle",
  MotorcycleSchema
);
