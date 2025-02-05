export class CreateMotorcycleDto {
  identifier: string;
  mileage: number;
  dateOfCommissioning: Date;
  status: string;
  companyIdentifier: string;
  modelIdentifier: string;
  guaranteeIdentifier: string;
  rentalIdentifiers: string[];
  maintenanceIdentifiers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateMotorcycleDto extends CreateMotorcycleDto {}
