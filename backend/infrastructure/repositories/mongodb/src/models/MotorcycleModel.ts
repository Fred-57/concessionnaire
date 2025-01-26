import { model, Schema } from "mongoose";
import { IModel } from "./ModelModel";
import { MotorcycleStatusEnum } from "@domain/types/MotorcycleStatusEnum";
import { IGuarantee } from "./GuaranteeModel";
import { ICompany } from "./CompanyModel";
import { IRental } from "./RentalModel";
import { IMaintenance } from "./MaintenanceModel";

export interface IMotorcycle {
  identifier: string;
  mileage: number;
  dateOfCommissioning: Date;
  status: MotorcycleStatusEnum;
  companyId: string;
  modelId: string;
  guaranteeId: string;
  rentals: IRental[];
  maintenances: IMaintenance[];
  createdAt: Date;
  updatedAt: Date;
}

export const MotorcycleSchema = new Schema<IMotorcycle>(
  {
    identifier: { type: String, required: true },
    mileage: { type: Number, required: true },
    dateOfCommissioning: { type: Date, required: true },
    status: { type: String, enum: MotorcycleStatusEnum, required: true },
    companyId: { type: String, required: true },
    modelId: { type: String, required: true },
    guaranteeId: { type: String, required: true },
    rentals: [{ type: Schema.Types.ObjectId, ref: "Rental" }],
    maintenances: [{ type: Schema.Types.ObjectId, ref: "Maintenance" }],
  },
  { timestamps: true }
);

export const MotorcycleModel = model<IMotorcycle>(
  "Motorcycle",
  MotorcycleSchema
);
