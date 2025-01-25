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
  company: ICompany;
  model: IModel;
  guarantee?: IGuarantee;
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
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    model: { type: Schema.Types.ObjectId, ref: "Model" },
    guarantee: { type: Schema.Types.ObjectId, ref: "Guarantee" },
    rentals: [{ type: Schema.Types.ObjectId, ref: "Rental" }],
    maintenances: [{ type: Schema.Types.ObjectId, ref: "Maintenance" }],
  },
  { timestamps: true }
);

export const MotorcycleModel = model<IMotorcycle>(
  "Motorcycle",
  MotorcycleSchema
);
