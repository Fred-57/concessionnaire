import { License } from "@domain/types/License";

export class CreateDriverDto {
  name: string;
  license: License;
  numberOfYearsOfExperience: number;
  companyIdentifier: string;
}

export class UpdateDriverDto extends CreateDriverDto {}
