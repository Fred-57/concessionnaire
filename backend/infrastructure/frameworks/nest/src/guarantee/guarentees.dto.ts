export class CreateGuaranteeDto {
  identifier: string;
  name: string;
  durationInMonths: number;
  coveredAmount: number;
  partsIdentifiers: string[];
  motorcyclesIdentifiers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateGuaranteeDto extends CreateGuaranteeDto {}
